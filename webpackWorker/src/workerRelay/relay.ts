const files: Record<string, Function> = {};

onmessage = (workerEvent) => {
    const { event, data } = workerEvent.data;
    switch (event) {
        case "IMPORT_SCRIPT": {
            console.log(data);
            const { module, scope, url, retries } = data;
            import(url)
                .then((module) => {
                    files[scope] = module;
                    console.log(files);
                })
                .catch(console.error);
            break;
        }
        case "RUN": {
            const { method, module, params, scope } = data;
            const splitModule = module.split("./");

            if (splitModule.length !== 2) {
                throw new Error("Invalid Module Passed");
            }

            console.log(self);
        }
        default:
            postMessage({ event: "PONG", pong: `PONG-[${data.scope}]` });
    }
};
