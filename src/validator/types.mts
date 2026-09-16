import type { CommonErrorImpl, CommonErrorInit, CommonErrorJSON } from '@utils';

export type RuleHandler<Value> = (value: Value) => boolean;

export interface Rule<Value> {
    readonly message: string;
    readonly handler: RuleHandler<Value>;
}

export interface ValidatorImpl<Value> {
    use(rule: Rule<Value>): this;
    run(): true;
}

export type ValidationErrorImpl = CommonErrorImpl;
export type ValidationErrorInit = CommonErrorInit;
export type ValidationErrorJSON = CommonErrorJSON;
