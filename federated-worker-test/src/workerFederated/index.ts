import { getHtmlElementById } from "../utils";
import { ImportModuleState, Job } from "./types";
import { FederatedWorker } from "federated-worker";

function setupFederatedWorker() {
  /// ---------------------- remoteModule worker --------------------
  const loadButton = getHtmlElementById<HTMLButtonElement>("loadMF");
  const sendButton = getHtmlElementById<HTMLButtonElement>("sendMF");

  /// ---------------------- remoteModule Module --------------------
  const remoteURL = getHtmlElementById<HTMLInputElement>("urlMF");
  const remoteScope = getHtmlElementById<HTMLInputElement>("scopeMF");
  const remoteModule = getHtmlElementById<HTMLInputElement>("moduleMF");
  // Load is fetched above

  /// ----------------------- remoteModule Function exec ------------
  const name = getHtmlElementById<HTMLInputElement>("remoteFunctionI");
  const module = getHtmlElementById<HTMLInputElement>("remoteFunctionM");
  const exec = getHtmlElementById<HTMLButtonElement>("remoteFunctionE");

  // @ts-ignore
  const remoteESMWorker = FederatedWorker();

  function v4UUID() {
    // https://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid
    // @ts-ignore: I know how strange this looks but it works
    return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
      (
        c ^
        (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
      ).toString(16)
    );
  }

  function loadModule(worker: Worker, data: ImportModuleState) {
    return new Promise((res, rej) => {
      const errorListener = (e: ErrorEvent) => {
        worker.removeEventListener("error", errorListener);
        rej(e);
      };
      const doneListener = (msg: MessageEvent<Job<ImportModuleState>>) => {
        if (
          msg.data.type === "IMPORT_MODULE_END" &&
          msg.data.state.url === data.url
        ) {
          worker.removeEventListener("message", doneListener);
          res(msg);
        }
      };
      worker.addEventListener("error", errorListener);
      worker.postMessage({
        type: "IMPORT_MODULE",
        state: data,
      } as Job<ImportModuleState>);
    });
  }

  // Quick Load
  sendButton.addEventListener("click", () => {
    Promise.all([
      remoteESMWorker.addModule({
        module: "./Remote",
        scope: "remoteworker",
        url: "http://localhost:3001/remote-worker.js",
      }),
      remoteESMWorker.addModule({
        module: "./Remote2",
        scope: "remoteworker2",
        url: "http://localhost:3002/remote-worker-2.js",
      }),
    ]).then(console.log);
  });

  loadButton.addEventListener("click", () => {
    if (!remoteURL?.value || !remoteScope?.value || !remoteModule?.value) {
      throw new Error("Trouble extracting module from inputs");
    }
    remoteESMWorker.addModule({
      url: remoteURL.value,
      scope: remoteScope.value,
      module: remoteModule.value,
    });

    remoteURL.value = "";
    remoteModule.value = "";
    remoteScope.value = "";
  });

  exec.addEventListener("click", (event) => {
    const functionName = name.value;
    const functionModule = module.value;

    name.value = "";
    module.value = "";

    remoteESMWorker.runMethod({
      method: functionName,
      module: functionModule,
    });
  });
}

export default setupFederatedWorker;
