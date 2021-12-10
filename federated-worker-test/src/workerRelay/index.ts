import { getHtmlElementById } from "../utils";
import { RelayImport } from "./types";

export * from "./types";

function setupRemoteWorker() {
  /// ---------------------- remoteModule worker --------------------
  const loadButton = getHtmlElementById<HTMLButtonElement>("load");
  const sendButton = getHtmlElementById<HTMLButtonElement>("send");
  const messages = getHtmlElementById<HTMLUListElement>("messages");

  const remoteESMWorker = new Worker(
    new URL("remoteModule.ts", import.meta.url)
  );
  console.log(remoteESMWorker);
  loadButton.addEventListener("click", () => {
    remoteESMWorker.postMessage({
      event: "IMPORT_SCRIPT",
      data: {
        url: "http://localhost:3001/remote-worker.system.js",
        scope: "remoteworker",
        module: "./Remote",
        retries: 0,
      },
    } as RelayImport);
  });

  sendButton.addEventListener("click", () => {
    remoteESMWorker.postMessage({ event: "PING", data: { scope: "PING" } });
  });

  remoteESMWorker.addEventListener(
    "message",
    (event: MessageEvent<{ event: "PONG"; pong: string }>) => {
      if (event.data.event === "PONG") {
        const newMessage = document.createElement("li");
        newMessage.innerHTML = event.data.pong;
        messages.appendChild(newMessage);
      }
    }
  );
}

export default setupRemoteWorker;
