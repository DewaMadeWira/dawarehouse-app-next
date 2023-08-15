/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    modularizeImports: {
	'lucide-react': {
	transform: 'lucide-react/dist/esm/icons/{{ kebabCase member}}'
		}
	}
};

module.exports = nextConfig;
