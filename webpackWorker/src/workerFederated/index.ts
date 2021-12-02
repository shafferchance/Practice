import { getHtmlElementById } from "../utils";
import { RelayImport } from "../workerRelay";
import {
  AsyncCallState,
  AsyncReturnState,
  ImportModuleState,
  ImportScriptState,
  Job,
} from "./types";

function setupFederatedWorker() {
  /// ---------------------- remoteModule worker --------------------
  const loadButton = getHtmlElementById<HTMLButtonElement>("loadMF");
  const sendButton = getHtmlElementById<HTMLButtonElement>("sendMF");
  // const messages = getHtmlElementById<HTMLUListElement>("messagesMF");

  /// ---------------------- remoteModule Module --------------------
  const remoteURL = getHtmlElementById<HTMLInputElement>("urlMF");
  const remoteScope = getHtmlElementById<HTMLInputElement>("scopeMF");
  const remoteModule = getHtmlElementById<HTMLInputElement>("moduleMF");
  // Load is fetched above

  /// ----------------------- remoteModule Function exec ------------
  const name = getHtmlElementById<HTMLInputElement>("remoteFunctionI");
  const module = getHtmlElementById<HTMLInputElement>("remoteFunctionM");
  const exec = getHtmlElementById<HTMLButtonElement>("remoteFunctionE");

  const remoteESMWorker = new Worker(
    new URL("remoteFederated.ts", import.meta.url)
  );

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
      loadModule(remoteESMWorker, {
        module: "./Remote",
        scope: "remoteworker",
        url: "http://localhost:3001/remote-worker.js",
      }),
      loadModule(remoteESMWorker, {
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
    remoteESMWorker.postMessage({
      type: "IMPORT_MODULE",
      state: {
        url: remoteURL.value,
        scope: remoteScope.value,
        module: remoteModule.value,
      },
    } as Job<ImportModuleState>);

    remoteURL.value = "";
    remoteModule.value = "";
    remoteScope.value = "";
  });

  exec.addEventListener("click", (event) => {
    const functionName = name.value;
    const functionModule = module.value;

    name.value = "";
    module.value = "";

    remoteESMWorker.postMessage({
      type: "ASYNC_METHOD_CALL",
      state: {
        method: functionName,
        module: functionModule,
      },
    } as Job<AsyncCallState>);
  });

  initializeFederatedWorker(remoteESMWorker, "statusMF", "messagesMF");
}

// Would be just the path to it but webpack :(
function initializeFederatedWorker(
  worker: Worker,
  statusId: string,
  messageId: string
) {
  worker.addEventListener(
    "message",
    (event: MessageEvent<Job<ImportScriptState>>) => {
      // Primaly used to import scripts without cross origin concerns
      // Please see: https://stackoverflow.com/questions/21913673/execute-web-worker-from-different-origin
      if (event.data.type === "IMPORT_SCRIPT_START") {
        console.log(event);
        if (!worker) {
          throw new Error("How did this message get here?");
        }

        const { id, parentJob, state } = event.data;
        const { url, host } = state;

        if (host) {
          const newHost = new URL(url);
          newHost.host = host; // There is a check above
          worker.postMessage({
            type: "IMPORT_SCRIPT_END",
            done: true,
            state: {
              url: newHost.toString(),
              host,
            },
            id,
            parentJob,
          } as Job<ImportScriptState>);
        } else {
          worker.postMessage({
            type: "IMPORT_SCRIPT_END",
            done: true,
            id,
            parentJob,
            state,
          } as Job<ImportScriptState>);
        }
      }
    }
  );

  worker.addEventListener(
    "message",
    (event: MessageEvent<Job<ImportModuleState>>) => {
      if (event.data.type === "IMPORT_MODULE_END") {
        const { done, state } = event.data;
        const { module, scope } = state;

        const status = document.getElementById(statusId);
        if (status) {
          status.innerText = `${
            done ? "SUCCESS" : "FAILED"
          }: ${scope}-${module}`;
        }
      }
    }
  );

  worker.addEventListener(
    "message",
    (event: MessageEvent<Job<AsyncReturnState>>) => {
      if (event.data.type === "ASYNC_METHOD_RETURN") {
        const { state } = event.data;
        const { method, module, result } = state;
        const messages = document.getElementById(messageId);

        const entry = document.createElement("li");
        entry.innerText = `${module}/${method}: ${
          typeof result === "object" ? JSON.stringify(result) : result
        }`;
        messages?.appendChild(entry);
      }
    }
  );
}

export default setupFederatedWorker;
