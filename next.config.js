/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    modularizeImports: {
        '@radix-ui/': {
            transform: '@radix-ui/{{member}}',
        },
    },
};

module.exports = nextConfig;
