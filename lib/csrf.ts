export function validateCsrf(req: Request): boolean {
    const origin = req.headers.get("origin");
    const host = req.headers.get("host");

    if (!origin || !host) return false;

    const originHost = new URL(origin).host;
    return originHost === host;
}