import chalk from "chalk";

function getData(): string {
  return "I'm remote data...";
}

function thingTwo(): string {
  return "I'm remote too";
}

function coloredPrint() {
  console.log(chalk.blue.bgRed.bold("remoteFile"));
}

export { getData, thingTwo, coloredPrint };
