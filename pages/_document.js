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
      
      <Head />
      
      <body className="antialiased">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
