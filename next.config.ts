
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    trailingSlash: true,

    // Ensure metadata is rendered inside <head> for SEO crawlers.
    htmlLimitedBots: /.*/,
    
    experimental: {
        agentFeedback: true,
    },

    cacheComponents: true,
    partialPrefetching: true,

    turbopack: {
        rules: {
            "*.css": {
                loaders: ["@tailwindcss/turbopack"],
                as: "*.css",
            },
        },
    },

    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "res.cloudinary.com",
                pathname: "/dw8nuv7r8/image/upload/**",
            },
        ],
    },
};

export default nextConfig;
