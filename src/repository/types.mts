export interface RepositoryErrorInit {
    readonly message?: string;
    readonly options?: ErrorOptions;
}

export interface RepositoryErrorJSON {
    name: string;
    message: string;
}
