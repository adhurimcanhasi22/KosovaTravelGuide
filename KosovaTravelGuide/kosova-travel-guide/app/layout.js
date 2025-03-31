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
<<<<<<< HEAD
        <Layout>{children}</Layout>
=======
        <Layout>
          {children}
          
        </Layout>
>>>>>>> e889acf18d035184f2b5da16b15a33b5e70361da
      </body>
    </html>
  );
}
