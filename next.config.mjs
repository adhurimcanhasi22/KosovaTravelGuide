// @ts-check

/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cf.bstatic.com',
        port: '',
        pathname: '/xdata/images/hotel/**', // This pattern allows any path under /xdata/images/hotel/
      },
      {
        protocol: 'https',
        hostname: 'img.freepik.com', // Added to allow images from Freepik
        port: '',
        pathname: '/free-photo/**', // This pattern allows any path under /free-photo/
      },
      {
        protocol: 'https',
        hostname: 'assets.hyatt.com', // ADD THIS ENTRY
        port: '',
        pathname:
          '/content/dam/hyatt/hyattdam/images/2024/07/05/0509/TXNRH-R0006-Family-Suite-Bedroom.jpg/TXNRH-R0006-Family-Suite-Bedroom.16x9.jpg', // Be specific
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com', // ADD THIS ENTRY
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
