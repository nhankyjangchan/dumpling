import { utils, consts } from '@utils';
import { ValidationError } from './errors.mts';
import type { ValidatorImpl, Rule } from './types.mts';

export class Validator<Entity = unknown> implements ValidatorImpl<Entity> {
    readonly #entity: Entity;
    readonly #rules: Rule<Entity>[];

    public constructor(entity: Entity) {
        this.#entity = entity;
        this.#rules = [];
    }

    public static for<Entity = unknown>(entity: Entity): Validator<Entity> {
        return new Validator<Entity>(entity);
    }

    public use(rule: Rule<Entity>): this {
        if (!Validator.isRule<Entity>(rule)) {
            throw new TypeError('Validator received an invalid rule object;');
        }
        this.#rules.push({ ...rule });
        return this;
    }

    public static isRule<Entity = unknown>(target: unknown): target is Rule<Entity> {
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
            if (!rule.handler(this.#entity)) {
                throw new ValidationError({ message: rule.message });
            }
        }
        return true;
    }
}
