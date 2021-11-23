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
        } as Job<ImportScriptState>);

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

                console.log("[Client Side]: ", state);
                if (host) {
                    const newHost = new URL(url);
                    newHost.host = host;
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
