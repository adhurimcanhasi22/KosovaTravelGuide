import "../app/globals.css";
import Layout from "@/components/Layout";
import { Signika_Negative } from "next/font/google";

const signikaNegative = Signika_Negative({
  subsets: ["latin"], // Specify the character set
  weight: ["300", "400", "500", "600", "700"], // Include all weights
});

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
      <body className={signikaNegative.className}>
        <Layout>{children}</Layout>
      </body>
    </html>
  );
}
