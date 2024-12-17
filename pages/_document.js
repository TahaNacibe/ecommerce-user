import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      {/* Preconnect to the Google Fonts domains for performance */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
      
      {/* Correct Google Fonts URL with valid weight range */}
      <link 
        href="https://fonts.googleapis.com/css2?family=Quicksand:wght@300;400;500;700&display=swap" 
        rel="stylesheet" 
      />
      <Head>
      <meta property="og:title" content="YukiShop" />
        <meta name="google-site-verification" content="mahsJqQPMTGTN9VzhF7sfIHNUa7N0GE72eKkMDBCX_4" />
        <meta name="description" content="A Template of a e-comarece website it's a portfolio project don't bother using it" />
        
      </ Head>
      
      <body className="antialiased">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
