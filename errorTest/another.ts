function importedMethod(thing: string) {
  throw new Error(thing);
}

function nullAccess() {
  const thing = undefined;

  console.log(thing.two);
}
