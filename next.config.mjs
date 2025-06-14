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
      {
        protocol: 'https',
        hostname: 'www.raymond.in', // ADD THIS ENTRY
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.yourstory.com', // ADD THIS ENTRY
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'img.cdndtl.co.uk', // ADD THIS ENTRY
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'dynamic-media-cdn.tripadvisor.com', // ADD THIS ENTRY
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'media-cdn.tripadvisor.com', // ADD THIS ENTRY
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'cdn.choosechicago.com', // ADD THIS ENTRY
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'funkytours.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'cdn.getyourguide.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'blog-img-dev.s3.ap-south-1.amazonaws.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'encrypted-tbn0.gstatic.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'vizitoshqip.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.kosovo-vacations.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'upload.wikimedia.org',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 's0.wklcdn.com',
        port: '',
        pathname: '/image_209/**',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'encrypted-tbn2.gstatic.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
