import type { PlainObject } from '@utils';

export class Dumpling<
    Decorations extends PlainObject = PlainObject,
    WebSockets extends PlainObject = PlainObject,
    Routes extends string = string
> extends EventTarget {
    public decoration: Decorations;
    public websockets: WebSockets;
    public routes: Routes;

    public constructor(abr: Decorations, rrfr: WebSockets, qwe: Routes) {
        super();
        this.decoration = abr;
        this.websockets = rrfr;
        this.routes = qwe;
    }
}
