import { utils } from '@utils';
import { ValidationError } from './errors.mts';
import type { Rule } from './types.mts';

export class Validator<E> {
    readonly #entity: E;
    readonly #rules: Rule<E>[];

    public constructor(entity: E) {
        this.#entity = entity;
        this.#rules = [];
    }

    public use(rule: Rule<E>): this {
        if (!Validator.isRule<E>(rule))
            throw new TypeError('The validator received an invalid rule;');
        this.#rules.push({ ...rule });
        return this;
    }

    public run(): true {
        for (const rule of this.#rules) {
            if (!rule.handler(this.#entity))
                throw new ValidationError({ message: rule.message });
        }
        return true;
    }

    public static isRule<E>(target: Rule<E>): target is Rule<E> {
        return (
            utils.isPlainObject(target)
            && utils.hasOwn(target, 'handler')
            && utils.isFunction(target.handler)
            && utils.hasOwn(target, 'message')
            && utils.isString(target.message)
        );
    }

    public static for<E>(entity: E): Validator<E> {
        return new Validator<E>(entity);
    }
}
