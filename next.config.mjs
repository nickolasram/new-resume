/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [new URL('https://ramirez-dev-new-resume.s3.us-west-1.amazonaws.com/**')]
    }
};



export default nextConfig;
