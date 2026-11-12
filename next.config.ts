
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    trailingSlash: true,

    // Ensure metadata is rendered inside <head> for SEO crawlers.
    htmlLimitedBots:
        /[\w-]+-Google|Google-[\w-]+|Chrome-Lighthouse|Slurp|DuckDuckBot|baiduspider|yandex|sogou|bitlybot|tumblr|vkShare|quora link preview|redditbot|ia_archiver|Bingbot|BingPreview|applebot|facebookexternalhit|facebookcatalog|Twitterbot|LinkedInBot|Slackbot|Discordbot|WhatsApp|SkypeUriPreview|Yeti|googleweblight|Screaming Frog SEO Spider/i,

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
