import { OutgoingResponse } from '@http/outgoing-response/module';
import { describe, test, expect } from 'bun:test';

describe('OutgoingResponse', () => {
    describe('new instance initialization', () => {
        test('creates a new instance', () => {
            expect(new OutgoingResponse()).toBeInstanceOf(OutgoingResponse);
        });

        test('applies defaults when called without init or with empty init', () => {
            for (const init of [undefined, {}]) {
                const response = new OutgoingResponse(init);
                expect(response.status).toBe(200);
                expect(response.statusText).toBe('');
                expect(response.headers).toBeInstanceOf(Headers);
                expect([...response.headers.keys()]).toHaveLength(0);
                expect(response.body).toBeNull();
            }
        });

        test('creates a fresh Headers instance per instance', () => {
            const a = new OutgoingResponse();
            const b = new OutgoingResponse();
            expect(a.headers).not.toBe(b.headers);
            a.headers.set('x-test', '1');
            expect(b.headers.has('x-test')).toBe(false);
        });

        test('stores all provided values as-is (including reference equality)', () => {
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

    describe('getters and setters', () => {
        test('status getter/setter', () => {
            const response = new OutgoingResponse();
            response.status = 404;
            expect(response.status).toBe(404);
        });

        test('statusText getter/setter', () => {
            const response = new OutgoingResponse();
            response.statusText = 'Not Found';
            expect(response.statusText).toBe('Not Found');
        });

        test('headers getter/setter replaces reference', () => {
            const response = new OutgoingResponse();
            const original = response.headers;
            const replacement = new Headers({ 'x-test': '1' });
            response.headers = replacement;
            expect(response.headers).toBe(replacement);
            expect(response.headers).not.toBe(original);
        });

        test('body getter/setter', () => {
            const response = new OutgoingResponse();
            response.body = 'hello';
            expect(response.body).toBe('hello');
            response.body = null;
            expect(response.body).toBeNull();
        });
    });

    describe('build', () => {
        test('returns a Response instance', () => {
            expect(new OutgoingResponse().build()).toBeInstanceOf(Response);
        });

        test('reflects values set after construction', async () => {
            const outgoing = new OutgoingResponse();
            outgoing.status = 201;
            outgoing.statusText = 'Created';
            outgoing.headers.set('x-id', '42');
            outgoing.body = 'ok';
            const response = outgoing.build();
            expect(response.status).toBe(201);
            expect(response.statusText).toBe('Created');
            expect(response.headers.get('x-id')).toBe('42');
            expect(await response.text()).toBe('ok');
        });

        test('handles string body', async () => {
            const response = new OutgoingResponse({ body: 'hello' }).build();
            expect(await response.text()).toBe('hello');
        });

        test('handles Uint8Array body', async () => {
            const body = new Uint8Array([1, 2, 3]);
            const response = new OutgoingResponse({ body }).build();
            expect(new Uint8Array(await response.arrayBuffer())).toEqual(body);
        });

        test('handles null body (including 204 status)', () => {
            const defaulted = new OutgoingResponse({ body: null }).build();
            expect(defaulted.body).toBeNull();
            const nullBodyStatus = new OutgoingResponse({ status: 204 }).build();
            expect(nullBodyStatus.status).toBe(204);
            expect(nullBodyStatus.body).toBeNull();
        });

        test('built Response is a snapshot, independent of later mutations', () => {
            const outgoing = new OutgoingResponse({ status: 200 });
            outgoing.headers.set('x-a', '1');
            const response = outgoing.build();
            outgoing.status = 500;
            outgoing.statusText = 'Internal Server Error';
            outgoing.headers.set('x-b', '2');
            expect(response.status).toBe(200);
            expect(response.statusText).toBe('');
            expect(response.headers.get('x-a')).toBe('1');
            expect(response.headers.get('x-b')).toBeNull();
        });

        test('throws RangeError for status outside [200, 599]', () => {
            expect(() => new OutgoingResponse({ status: 199 }).build()).toThrow(RangeError);
            expect(() => new OutgoingResponse({ status: 600 }).build()).toThrow(RangeError);
        });

        test('Bun allows non-null body with null-body status (no spec validation)', () => {
            const response = new OutgoingResponse({ status: 204, body: 'x' }).build();
            expect(response.status).toBe(204);
        });

        test('Bun allows CR/LF in statusText (no spec validation)', () => {
            const response = new OutgoingResponse({ statusText: 'a\nb' }).build();
            expect(response.statusText).toBe('a\nb');
        });
    });
});
