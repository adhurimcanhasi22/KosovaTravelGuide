import "./globals.css";
import Layout from "@/components/Layout";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <title>Kosovo Travel Guide - Discover the Heart of the Balkans</title>
        <meta
          name="description"
          content="Explore the beauty of Kosovo - Europe's youngest country."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body>
        <Layout>{children}</Layout>
      </body>
    </html>
  );
}
