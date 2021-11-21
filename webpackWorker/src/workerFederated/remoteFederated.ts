import {
    AsyncCallState,
    AsyncReturnState,
    ImportModuleState,
    Job,
    Script,
    WorkerJobHandlers,
    WorkerJobMessage,
    WorkerJobs,
} from "./types";

declare global {
    // Interface merging FTW!!!!!!!
    interface Document {
        getElementsByTagName(
            element: "script"
        ): HTMLCollectionOf<HTMLScriptElement>;
        createElement(element: "script"): HTMLScriptElement;
    }
    interface Window {
        scripts: Array<Script>;
        jobs: Job<ImportModuleState | ImportModuleState | AsyncCallState>[];
    }

    interface Window {
        [scope: string]: {
            get: <T = any>(module: string) => Promise<T>;
            init: <T = any>(module: string) => Promise<T>;
            [method: string]: Function;
        };
    }
}

importScripts.bind(self);

self.scripts = [];
self.jobs = [];

self.document = {
    ...self.document,
    head: {
        appendChild: (childNode: Script) => {
            try {
                console.log(childNode);
                importScripts(childNode.src || childNode.getAttribute("src"));
                childNode.onload && childNode.onload();
            } catch (e) {
                console.error(e);
                childNode.onerror && childNode.onerror(e as Error);
            }
        },
    } as unknown as HTMLHeadElement,
    getElementsByTagName: (element: "script") => {
        return self.scripts as unknown as HTMLCollectionOf<HTMLScriptElement>;
    },
    createElement: (element: "script") =>
        ({
            src: undefined,
            attributes: {},
            getAttribute(attribute: "src") {
                return this.attributes?.[attribute];
            },
            setAttribute(attribute: "src", value: string) {
                this.attributes[attribute] = value;
            },
            onload: undefined,
            onerror: undefined,
        } as Script as unknown as HTMLScriptElement),
};

console.log(self);

const handlers: WorkerJobHandlers = {
    ASYNC_METHOD_CALL: (job) => {
        const { state, id } = job;
        const { args, async, method, module } = state;
        if (!self[module]) {
            throw new Error(`Module [${module}] does not exist`);
        }

        if (!self[module][method]) {
            throw new Error(
                `Method [${method}] does not exist in Module [${module}]`
            );
        }

        let newArgs = Array.isArray(args) ? args : [args];

        // The method it-self might not be async...
        if (async) {
            return self[module][method](...newArgs)
                .then((result: unknown) => {
                    postMessage({
                        type: "ASYNC_METHOD_RETURN",
                        state: {
                            method,
                            module,
                            result,
                        },
                        id,
                    } as Job<AsyncReturnState>);
                    return Promise.resolve(true);
                })
                .catch((error: Error) => {
                    console.error(error);
                    return Promise.resolve(false);
                });
        } else {
            try {
                const result = self[module][method](...newArgs);
                postMessage({
                    type: "ASYNC_METHOD_RETURN",
                    state: {
                        method,
                        module,
                        result,
                    },
                    id,
                } as Job<AsyncReturnState>);
                if (id) {
                    return true;
                }
            } catch (e) {
                console.error(e);
                return false;
            }
        }
    },
    IMPORT_MODULE: (job) => {
        const { state } = job;
        const { module, scope, url } = state;
        // Parse Module Map
        // Order all scripts
        // Load Federated Module
    },
    IMPORT_SCRIPT_START: (job) => {
        postMessage(job);
    },
    IMPORT_SCRIPT_END: (job) => {
        const { url } = job.state;
        importScripts(url);
        // TODO: resolve done
    },
};

onmessage = (workerEvent: WorkerJobMessage) => {
    const { type, state, id, done, parentJob } = workerEvent.data;

    const handler = handlers[type as WorkerJobs];

    if (!handler) {
        throw new Error(`No handler found for Job [${type}]`);
    }

    try {
        // TODO: Job State mgmt
        // @ts-ignore: Why have all the extra code of the switch if we can do the same with an ignore 🤷‍♂️
        handler(workerEvent.data);
    } catch (e) {
        // Extra layer of protection
        console.error(e);
    }

    // switch (type) {
    //     case "IMPORT_SCRIPT_START":
    //         handlers[type](workerEvent.data as Job<ImportModuleState);
    //     case "IMPORT_MODULE": {
    //         // const { module, scope, url} = state;
    //         // const script = document.createElement(
    //         //     "script"
    //         // ) as unknown as Script;
    //         // const formattedURL = new URL(url);
    //         // script.src = url;
    //         // self.scripts.push(script);
    //         // console.log(document.getElementsByTagName("script"));
    //         // importScripts(url);
    //         // console.log(self);
    //         // self[scope].get
    //         //     .bind(self)(module)
    //         //     .then((remoteModule) => {
    //         //         console.log(remoteModule);
    //         //     });
    //         handlers[type](workerEvent.data as Job<ImportModuleState>);
    //         break;
    //     }
    //     default:
    //         postMessage({ event: "PONG", pong: `PONG-[${data.scope}]` });
    // }
};
