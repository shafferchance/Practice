function getData(): string {
  return "I'm remote data...";
}

function thingTwo(): string {
  return "I'm remote too";
}
// @ts-ignore
self.things = { getData, thingTwo };
