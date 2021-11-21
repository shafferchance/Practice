import { getHtmlElementById } from "../utils";
import { RelayImport } from "../workerRelay";
import { ImportModuleState, ImportScriptState, Job } from "./types";

function setupFederatedWorker() {
    /// ---------------------- remoteModule worker --------------------
    const loadButton = getHtmlElementById<HTMLButtonElement>("loadMF");
    const sendButton = getHtmlElementById<HTMLButtonElement>("sendMF");
    const messages = getHtmlElementById<HTMLUListElement>("messagesMF");

    const remoteESMWorker = new Worker(
        new URL("remoteFederated.ts", import.meta.url)
    );

    loadButton.addEventListener("click", () => {
        remoteESMWorker.postMessage({
            type: "IMPORT_SCRIPT_START",
            state: {
                url: "http://localhost:3001/remote-worker.js",
                // scope: "remoteworker",
                // module: "./Remote",
            },
        } as Job<ImportScriptState>);
    });

    sendButton.addEventListener("click", () => {
        remoteESMWorker.postMessage({ event: "PING", data: { scope: "PING" } });
    });

    initializeFederatedWorker(remoteESMWorker);
}

// Would be just the path to it but webpack :(
function initializeFederatedWorker(worker: Worker) {
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

                worker.postMessage({
                    type: "IMPORT_SCRIPT_END",
                    done: true,
                    id,
                    parentJob,
                    state,
                } as Job<ImportScriptState>);
            }
        }
    );
}

export default setupFederatedWorker;
