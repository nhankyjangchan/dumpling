import type { ErrorImpl, ErrorInit, ErrorJSON } from '@utils';

export type RuleHandler<E> = (entity: E) => boolean;

export interface Rule<E> {
    readonly handler: RuleHandler<E>;
    readonly message: string;
}

export interface ValidatorImpl<E> {
    use(rule: Rule<E>): this;
    run(): true;
}

export interface ValidationErrorImpl extends ErrorImpl {}
export interface ValidationErrorInit extends ErrorInit {}
export interface ValidationErrorJSON extends ErrorJSON {}
