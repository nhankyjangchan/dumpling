import { OutgoingResponse } from '@http/outgoing-response/module';
import { describe, test, expect } from 'bun:test';

describe('OutgoingResponse', (): void => {
    describe('constructor', (): void => {
        test('Creates a new instance', (): void => {
            expect(new OutgoingResponse()).toBeInstanceOf(OutgoingResponse);
        });

        test('Applies defaults when called without init or with empty init', (): void => {
            for (const init of [undefined, {}]) {
                const response = new OutgoingResponse(init);
                expect(response.status).toBe(200);
                expect(response.statusText).toBe('');
                expect(response.headers).toBeInstanceOf(Headers);
                expect([...response.headers.keys()]).toHaveLength(0);
                expect(response.body).toBeNull();
            }
        });

        test('Creates a fresh Headers instance per instance', (): void => {
            const a = new OutgoingResponse();
            const b = new OutgoingResponse();
            expect(a.headers).not.toBe(b.headers);
            a.headers.set('x-test', '1');
            expect(b.headers.has('x-test')).toBe(false);
        });

        test('Stores all provided values as-is (including reference equality)', (): void => {
            const headers = new Headers({ 'x-test': '1' });
            const body = new Uint8Array([1, 2, 3]);
            const response = new OutgoingResponse({
                status: 201,
                statusText: 'Created',
                headers,
                body
            });
            expect(response.status).toBe(201);
            expect(response.statusText).toBe('Created');
            expect(response.headers).toBe(headers);
            expect(response.body).toBe(body);
        });
    });

    describe('getters and setters', (): void => {
        test('status getter/setter', (): void => {
            const response = new OutgoingResponse();
            response.status = 404;
            expect(response.status).toBe(404);
        });

        test('statusText getter/setter', (): void => {
            const response = new OutgoingResponse();
            response.statusText = 'Not Found';
            expect(response.statusText).toBe('Not Found');
        });

        test('headers getter/setter replaces reference', (): void => {
            const response = new OutgoingResponse();
            const original = response.headers;
            const replacement = new Headers({ 'x-test': '1' });
            response.headers = replacement;
            expect(response.headers).toBe(replacement);
            expect(response.headers).not.toBe(original);
        });

        test('body getter/setter', (): void => {
            const response = new OutgoingResponse();
            response.body = 'hello';
            expect(response.body).toBe('hello');
            response.body = null;
            expect(response.body).toBeNull();
        });
    });

    describe('build', (): void => {
        test('Returns a Response instance', (): void => {
            expect(new OutgoingResponse().build()).toBeInstanceOf(Response);
        });

        test('Reflects values set after construction', (): void => {
            const outgoing = new OutgoingResponse();
            outgoing.status = 201;
            outgoing.statusText = 'Created';
            outgoing.headers.set('x-id', '42');
            outgoing.body = 'ok';
            const response = outgoing.build();
            expect(response.status).toBe(201);
            expect(response.statusText).toBe('Created');
            expect(response.headers.get('x-id')).toBe('42');
        });

        test('Handles string body', async (): Promise<void> => {
            const response = new OutgoingResponse({ body: 'hello' }).build();
            expect(await response.text()).toBe('hello');
        });

        test('Handles Uint8Array body', async (): Promise<void> => {
            const body = new Uint8Array([1, 2, 3]);
            const response = new OutgoingResponse({ body }).build();
            expect(new Uint8Array(await response.arrayBuffer())).toEqual(body);
        });

        test('Handles null body', (): void => {
            const response = new OutgoingResponse({ body: null }).build();
            expect(response.body).toBeNull();
        });

        test('Allows null body with null-body status (204)', (): void => {
            const response = new OutgoingResponse({ status: 204 }).build();
            expect(response.status).toBe(204);
            expect(response.body).toBeNull();
        });

        test('Copies headers into Response (subsequent mutations do not leak)', (): void => {
            const outgoing = new OutgoingResponse();
            outgoing.headers.set('x-a', '1');
            const response = outgoing.build();
            outgoing.headers.set('x-b', '2');
            expect(response.headers.get('x-a')).toBe('1');
            expect(response.headers.get('x-b')).toBeNull();
        });

        test('Built Response is a snapshot, independent of later mutations', (): void => {
            const outgoing = new OutgoingResponse({ status: 200 });
            const response = outgoing.build();
            outgoing.status = 500;
            outgoing.statusText = 'Internal Server Error';
            expect(response.status).toBe(200);
            expect(response.statusText).toBe('');
        });

        test('Throws RangeError for status outside [200, 599]', (): void => {
            expect(() => new OutgoingResponse({ status: 199 }).build()).toThrow(RangeError);
            expect(() => new OutgoingResponse({ status: 600 }).build()).toThrow(RangeError);
        });

        test('Bun allows non-null body with null-body status (no spec validation)', (): void => {
            const response = new OutgoingResponse({ status: 204, body: 'x' }).build();
            expect(response.status).toBe(204);
        });

        test('Bun allows CR/LF in statusText (no spec validation)', (): void => {
            const response = new OutgoingResponse({ statusText: 'a\nb' }).build();
            expect(response.statusText).toBe('a\nb');
        });
    });
});
