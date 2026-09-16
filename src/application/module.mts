export class Dumpling<
    Decorations = unknown,
    WebSockets = unknown,
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
