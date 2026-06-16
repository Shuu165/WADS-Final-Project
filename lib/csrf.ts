export function validateCsrf(req: Request): boolean {
    const origin = req.headers.get("origin");
    const host = req.headers.get("host");

    if (!origin || !host) return false;

    const originHost = new URL(origin).host;
    
    const allowedOrigins = [
        host,
        "e2526-wads-b4ac-03.csbihub.id",
        "localhost:3000",
    ];

    return allowedOrigins.includes(originHost);
}