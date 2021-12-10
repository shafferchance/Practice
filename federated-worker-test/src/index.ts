import setupFederatedWorker from "./workerFederated";
import setupRemoteWorker from "./workerRelay";
import setupFederatedModule from "./loadRemoteFederated";

setupRemoteWorker();
setupFederatedWorker();
setupFederatedModule(
    "http://localhost:3001/remote-worker.js",
    "remoteworker",
    "./Remote"
);
