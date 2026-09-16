import type { ErrorImpl, ErrorInit, ErrorJSON } from '@utils';

export type RuleHandler<Entity> = (entity: Entity) => boolean;

export interface Rule<Entity> {
    readonly message: string;
    readonly handler: RuleHandler<Entity>;
}

export interface ValidatorImpl<Entity> {
    use(rule: Rule<Entity>): this;
    run(): true;
}

export type ValidationErrorImpl = ErrorImpl;
export type ValidationErrorInit = ErrorInit;
export type ValidationErrorJSON = ErrorJSON;
