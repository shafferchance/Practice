declare module "remoteworker/Remote" {
    interface Methods {
        getData(): string;
        thingTwo(): string;
    }

    type Factory = () => Methods;

    export = Factory;
}
