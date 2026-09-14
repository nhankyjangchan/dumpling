export class Dumpling<D = any, W = any, R extends string = string> extends EventTarget {
    a: D;
    w: W;
    r: R;

    constructor(a: D, w: W, r: R) {
        super();
        this.a = a;
        this.w = w;
        this.r = r;
    }
}
