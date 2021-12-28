/// <reference lib="webworker" />

declare global {
  interface Window {
    remoteGet: typeof remoteGet;
    remoteSet: typeof remoteSet;
  }
}

import chalk from "chalk";

function remoteGet(): string {
  return "Getting data from remote";
}

function remoteSet(key: string, value: string): string {
  return `Setting data [${key}] to [${value}]`;
}

function coloredPrint() {
  console.log(chalk.blue.bgRed.bold("remoteFile"));
}

// If in worker environment these will be auto appended to the worker's scope
if (
  "undefined" !== typeof WorkerGlobalScope &&
  "function" === typeof importScripts &&
  navigator instanceof WorkerNavigator
) {
  self.remoteGet = remoteGet;
  self.remoteSet = remoteSet;
}

export { remoteGet, remoteSet, coloredPrint };
