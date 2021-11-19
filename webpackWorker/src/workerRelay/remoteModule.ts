import {
  RelayMessage,
  RelayImport,
  RelayImportResponse,
  RelayRun,
} from "./types";

const files: Record<string, Record<string, Function>> = {};
// @ts-ignore
self.document = self;

onmessage = (workerEvent: RelayMessage) => {
  const { event, data } = workerEvent.data;
  switch (event) {
    case "IMPORT_SCRIPT": {
      console.log(data);
      const { module, scope, url, retries, esm } = data as RelayImport["data"];

      if (esm) {
        import(/* webpackIgnore: true */ url)
          .then((remoteModule) => {
            files[scope] = remoteModule;
            postMessage({ event, status: "SUCCESS" });
          })
          .catch(console.error);
      } else {
        importScripts(url);
        console.log(self);
        postMessage({ event, status: "SUCCESS" });
      }
      break;
    }
    case "RUN": {
      const { method, module, params, scope } = data as RelayRun["data"];
      const splitModule = module.split("./");

      if (splitModule.length !== 2) {
        throw new Error("Invalid Module Passed");
      }

      console.log(self);

      const methodToCall = files[splitModule[1]][method];

      if (methodToCall) {
        const result = files[splitModule[1]][method](...params);
        postMessage({
          event,
          result,
          status: "SUCCESS",
        });
      } else {
        postMessage({
          event,
          status: "ERR_NOT_FOUND",
        });
      }
      break;
    }
    default:
      postMessage({ event: "PONG", pong: `PONG-[${data.scope}]` });
  }
};
