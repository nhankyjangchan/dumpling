import { utils, consts } from '@utils';
import { ValidationError } from './errors.mts';
import type { ValidatorImpl, Rule } from './types.mts';

export class Validator<E = unknown> implements ValidatorImpl<E> {
    readonly #entity: E;
    readonly #rules: Rule<E>[];

    public constructor(entity: E) {
        this.#entity = entity;
        this.#rules = [];
    }

    public static for<E = unknown>(entity: E): Validator<E> {
        return new Validator<E>(entity);
    }

    public use(rule: Rule<E>): this {
        if (!Validator.isRule<E>(rule))
            throw new TypeError('Validator received an invalid rule object;');
        this.#rules.push({ ...rule });
        return this;
    }

    public static isRule<E>(target: unknown): target is Rule<E> {
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
            if (!rule.handler(this.#entity))
                throw new ValidationError({ message: rule.message });
        }
        return true;
    }
}
