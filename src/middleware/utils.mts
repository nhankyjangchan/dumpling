import { Rule, Validator, ValidationError } from '@validator';
import type { MiddlewareInit } from './types.mts';

export const middlewareInitRules: Rule<MiddlewareInit<any, any, any>>[] = [
    Rule.create({
        message: 'The middleware init must be a plain object;\n',
        handler(e: MiddlewareInit<any, any, any>): boolean {
            const isObjectLike: boolean = !!e && typeof e === 'object';
            return isObjectLike && Object.getPrototypeOf(e) === Object.prototype;
        }
    }),
    Rule.create({
        message: 'The middleware bootstrap is required must be a function;\n',
        handler(e: MiddlewareInit<any, any, any>): boolean {
            const hasOwn: boolean = Object.hasOwn(e, 'bootstrap');
            return hasOwn && typeof e.bootstrap === 'function';
        }
    }),
    Rule.create({
        message: 'The middleware manifest is required;\n',
        handler(e: MiddlewareInit<any, any, any>): boolean {
            const hasOwn: boolean = !!e.manifest && Object.hasOwn(e, 'manifest');
            return hasOwn && typeof e.manifest === 'object';
        }
    }),
    Rule.create({
        message: 'The middleware manifest must be a plain object;\n',
        handler(e: MiddlewareInit<any, any, any>): boolean {
            const isPlain: boolean = Object.getPrototypeOf(e.manifest) === Object.prototype;
            return isPlain;
        }
    }),
    Rule.create({
        message: 'The middleware name is not specified or does not match the pattern;\n',
        handler(e: MiddlewareInit<any, any, any>): boolean {
            const name: string = e.manifest.name;
            return typeof name === 'string' && /^[a-z0-9_-]+@middleware$/i.test(name);
        }
    }),
    Rule.create({
        message: 'The middleware hook is not specified or does not match the pattern;\n',
        handler(e: MiddlewareInit<any, any, any>): boolean {
            const hook: string = e.manifest.hook;
            return typeof hook === 'string' && /^on(Request|Response|Error)$/.test(hook);
        }
    }),
    Rule.create({
        message: 'The middleware type is not specified or does not match the pattern;\n',
        handler(e: MiddlewareInit<any, any, any>): boolean {
            const type: string = e.manifest.type;
            return typeof type === 'string' && /^(sync|async)$/.test(type);
        }
    })
];

export function isMiddlewareInit(target: any): boolean | ValidationError<any> {
    try {
        return Validator.for<MiddlewareInit<any, any, any>>(target)
            .use(...middlewareInitRules)
            .run();
    } catch (e: unknown) {
        if (e instanceof ValidationError)
            return e;
        return new ValidationError<any>({ message: String(e) });
    }
}
