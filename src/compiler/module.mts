export class JITCompiler {
    public static TRY = 'try {';
}

Response;
/**
 * GET: async (request, server) => {
 *   try {
 *     const rc = new RequestContext(app, server, request)
 *     rm1(e)
 *     const rm2r = await rm2(rc);
 *     if (rm2r instanceof Response) {
 *       return rm2r
 *     }
 *     return h(rc);
 *   } catch (e) {
 *     if (!(e instanceof HttpError)) {
 *       return new Response(null, { status: 500 });
 *     }
 *     em1(e);
 *     await em2(e);
 *     const em3r = em3(e);
 *     if (em3r instanceof Response) {
 *       return em3r;
 *     }
 *     const em4r = await em4(e);
 *     if (em4r instanceof Response) {
 *       return em4r;
 *     }
 *     return new Response(null, { status: 500 });
 *   }
 * }
 */
