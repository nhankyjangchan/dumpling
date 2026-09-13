import type { RuleInit } from './types.mts';

/**
 * It’s 2026, and TS still doesn't support type narrowing with `Object.hasOwn`.
 * The `in` operator is needed for type narrowing; bypassing this with `as any` is bad practice.
 */
export function isRuleInit<E>(target: unknown): target is RuleInit<E> {
    return (
        !!target
        && typeof target === 'object'
        && Object.getPrototypeOf(target) === Object.prototype
        && 'handler' in target
        && Object.hasOwn(target, 'handler')
        && typeof target.handler === 'function'
        && 'message' in target
        && Object.hasOwn(target, 'message')
        && typeof target.message === 'string'
    );
}
