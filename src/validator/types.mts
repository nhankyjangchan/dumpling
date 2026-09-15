export type RuleHandler<E> = (entity: E) => boolean;

export interface Rule<E> {
    readonly handler: RuleHandler<E>;
    readonly message: string;
}

export interface ValidatorImpl<E> {
    use(rule: Rule<E>): this;
    run(): true;
}

export interface ValidationErrorInit {
    readonly message?: string;
    readonly options?: ErrorOptions;
}

export interface ValidationErrorJSON {
    name: string;
    message: string;
}
