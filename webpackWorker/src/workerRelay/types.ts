export type RelayMessage<T = RelayImport | RelayRun> = MessageEvent<T>;

export interface RelayBase<T> {
    event: "IMPORT_SCRIPT" | "RUN" | "LOAD_SCRIPT";
    data: T;
}

export interface RelayImportResponse extends RelayImport {
    event: "LOAD_SCRIPT";
}

export type RelayImport = RelayBase<{
    url: string;
    scope: string;
    module: string;
    retries: number;
}>;

export type RelayRun = RelayBase<{
    scope: string;
    module: string;
    method: string;
    params: any[];
}>;
