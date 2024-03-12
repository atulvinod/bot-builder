/** @type {import('next').NextConfig} */
const nextConfig = {
    typescript: {
        ignoreBuildErrors: true
    },
    images: {
        dangerouslyAllowSVG: true,
        remotePatterns: [
            {
                protocol: "https",
                hostname: "api.dicebear.com",
                port: "",
                pathname: "/7.x/**"
            }, {
                protocol: "https",
                hostname: "*.googleusercontent.com"
            }, {
                protocol: "https",
                hostname: "firebasestorage.googleapis.com"
            }
        ]
    }
};

export default nextConfig;
