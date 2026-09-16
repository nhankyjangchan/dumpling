import { utils, consts } from '@utils';
import { ValidationError } from './errors.mts';
import type { ValidatorImpl, Rule } from './types.mts';

export class Validator<Value> implements ValidatorImpl<Value> {
    readonly #value: Value;
    readonly #rules: Rule<Value>[];

    public constructor(value: Value) {
        this.#value = value;
        this.#rules = [];
    }

    public static for<Value>(value: Value): Validator<Value> {
        return new Validator(value);
    }

    public use(rule: Rule<Value>): this {
        if (!Validator.isRule(rule)) {
            throw new TypeError('Validator received an invalid rule object;');
        }
        this.#rules.push({ ...rule });
        return this;
    }

    public static isRule(target: unknown): target is Rule<unknown> {
        return (
            utils.isPlainObject(target)
            && utils.hasOwn(target, consts.handler)
            && utils.isFunction(target.handler)
            && utils.hasOwn(target, consts.message)
            && utils.isString(target.message)
        );
    }

    public run(): true {
        for (const rule of this.#rules) {
            if (!rule.handler(this.#value)) {
                throw new ValidationError({ message: rule.message });
            }
        }
        return true;
    }
}
