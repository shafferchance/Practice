import { RelayImport, RelayMessage } from "../workerRelay";

// @ts-ignore
self.document = self;

onmessage = (workerEvent: RelayMessage) => {
  const { event, data } = workerEvent.data;
  switch (event) {
    case "LOAD_SCRIPT":
    case "IMPORT_SCRIPT": {
      console.log(data);
      const { module, scope, url, retries } = data as RelayImport["data"];
      importScripts(url);
      console.log(self.document);
      // @ts-ignore
      self[scope].get(module).then((remoteModule) => {
        console.log(remoteModule);
      });
      break;
    }
    default:
      postMessage({ event: "PONG", pong: `PONG-[${data.scope}]` });
  }
};
