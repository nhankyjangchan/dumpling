export type RuleHandler<E> = (entity: E) => boolean;

export interface RuleInit<E> {
    readonly handler: RuleHandler<E>;
    readonly message: string;
}

export interface ValidationErrorInit<E> {
    readonly message?: string;
    readonly entity?: E;
    readonly options?: ErrorOptions;
}

export interface ValidationErrorJSON<E> {
    name: string;
    message: string;
    entity: E | undefined;
}
