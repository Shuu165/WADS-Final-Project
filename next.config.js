const nextConfig = {
    output: "standalone",
    reactCompiler: true,
    serverExternalPackages: ['firebase-admin'],
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "lh3.googleusercontent.com",
            },
        ],
    },
    async headers() {
        return [
            {
                source: "/api/(.*)",
                headers: [
                    { key: "Access-Control-Allow-Origin", value: "*" },
                    { key: "Access-Control-Allow-Methods", value: "GET, POST, PUT, DELETE, OPTIONS" },
                    { key: "Access-Control-Allow-Headers", value: "Content-Type, Authorization" },
                    { key: "Content-Range", value: "bytes : 0-9/*" },
                ],
            },
        ];
    },
};

export default nextConfig;