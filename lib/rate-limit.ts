const rateLimitMap = new Map<string, { count: number; lastReset: number }>();

export function rateLimit(identifier: string, limit: number = 10, windowMs: number = 60000): boolean {
    const now = Date.now();
    const record = rateLimitMap.get(identifier);

    if (!record || now - record.lastReset > windowMs) {
        rateLimitMap.set(identifier, { count: 1, lastReset: now });
        return true; // allowed
    }

    if (record.count >= limit) {
        return false; // blocked
    }

    record.count++;
    return true; // allowed
}