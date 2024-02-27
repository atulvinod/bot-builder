/** @type {import('next').NextConfig} */
const nextConfig = {
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
            }
        ]
    }
};

export default nextConfig;
