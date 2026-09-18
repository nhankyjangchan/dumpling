export class JITCompiler {
    readonly #TRY = 'try {';
    readonly #CATCH = 'catch (e) {';
    readonly #end = '}';

    public if(condition: unknown, body: unknown) {
        return `if (${condition}) {
            ${body}
        }`;
    }
}
