export interface RepositoryErrorInit<K extends PropertyKey, V> {
    readonly message?: string;
    readonly options?: ErrorOptions;
    readonly key?: K;
    readonly value?: V;
}

export interface RepositoryErrorJSON<K extends PropertyKey, V> {
    name: string;
    message: string;
    entity: RepositoryEntity<K, V>;
}

export interface RepositoryEntity<K extends PropertyKey, V> {
    readonly key: K | undefined;
    readonly value: V | undefined;
}
