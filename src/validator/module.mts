import { isRuleInit } from './utils.mts';
import { ValidationError } from './errors.mts';
import type { RuleHandler, RuleInit } from './types.mts';

export class Validator<E> {
    readonly #entity: E;
    readonly #rules: Rule<E>[];

    public constructor(entity: E) {
        this.#entity = entity;
        this.#rules = [];
    }

    public static for<E>(entity: E): Validator<E> {
        return new Validator<E>(entity);
    }

    public use(...rules: Rule<E>[]): this {
        for (const rule of rules) {
            if (!(rule instanceof Rule))
                throw new TypeError(`The validator expects an instance of the Rule;\n`);
        }
        this.#rules.push(...rules);
        return this;
    }

    public run(): boolean {
        for (const rule of this.#rules) {
            if (!rule.handler(this.#entity))
                throw new ValidationError<E>({ entity: this.#entity, message: rule.message });
        }
        return true;
    }
}

export class Rule<E> {
    readonly #handler: RuleHandler<E>;
    readonly #message: string;

    public constructor(init: RuleInit<E>) {
        if (!isRuleInit<E>(init))
            throw new TypeError(`Incorrect rule context;\n`);
        this.#handler = init.handler;
        this.#message = init.message;
    }

    public static create<E>(init: RuleInit<E>): Rule<E> {
        return new Rule<E>(init);
    }

    public get handler(): RuleHandler<E> {
        return this.#handler;
    }

    public get message(): string {
        return this.#message;
    }
}
