import {
    RelayBase,
    RelayImport,
    RelayImportResponse,
    RelayRun,
} from "./workerRelay";

let currentScript: HTMLElement;

// Really want to dynamic import instead but webpack....
function dynamicallyAddScript(url: string) {
    return new Promise((res, rej) => {
        const newScript = document.createElement("script");
        newScript.src = url;
        newScript.type = "text/javascript";
        newScript.async = true;

        newScript.onload = () => {
            res(true);
        };

        newScript.onerror = (e) => {
            console.error(e);
            rej(e);
        };

        if (currentScript) {
            document.head.removeChild(currentScript);
        }
        document.head.appendChild(newScript);
        currentScript = newScript;
    });
}

function createWorkerWithRemote(): Worker {
    const worker = new Worker(new URL("workerRelay/relay.ts", import.meta.url));

    // worker.addEventListener(
    //     "message",
    //     (workerEvent: MessageEvent<RelayImportResponse>) => {
    //         const {
    //             event,
    //             data: { url, scope, module, retries },
    //         } = workerEvent.data;
    //         if (event === "LOAD_SCRIPT") {
    //             dynamicallyAddScript(url)
    //                 .then(() => {
    //                     console.log("Script downloaded");
    //                     if (retries < 3) {
    //                         worker.postMessage({
    //                             event: "IMPORT_SCRIPT",
    //                             data: {
    //                                 module,
    //                                 scope,
    //                                 url,
    //                                 retries: retries + 1,
    //                             },
    //                         } as RelayImport);
    //                     } else {
    //                         throw new Error("Max retries reached");
    //                     }
    //                 })
    //                 .catch(console.error);
    //         }
    //     }
    // );

    return worker;
}

function getHtmlElementById<T extends HTMLElement>(id: string): T {
    return document.getElementById(id) as T;
}

const loadButton = getHtmlElementById<HTMLButtonElement>("load");
const sendButton = getHtmlElementById<HTMLButtonElement>("send");
const messages = getHtmlElementById<HTMLUListElement>("messages");

const worker = createWorkerWithRemote();
loadButton.addEventListener("click", () => {
    worker.postMessage({
        event: "IMPORT_SCRIPT",
        data: {
            url: "http://localhost:3001/remote-worker.js",
            scope: "remoteworker",
            module: "./Remote",
            retries: 0,
        },
    } as RelayImport);
});

sendButton.addEventListener("click", () => {
    worker.postMessage({ event: "PING", data: { scope: "PING" } });
});

worker.addEventListener(
    "message",
    (event: MessageEvent<{ event: "PONG"; pong: string }>) => {
        if (event.data.event === "PONG") {
            const newMessage = document.createElement("li");
            newMessage.innerHTML = event.data.pong;
            messages.appendChild(newMessage);
        }
    }
);
