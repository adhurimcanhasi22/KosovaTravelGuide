import './globals.css';
import Layout from '../components/Layout';

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
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
        />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
        />
      </head>
      <body>
        <Layout>{children}</Layout>
      </body>
    </html>
  );
}
