import React from 'react';
import { AppProps } from 'next/app';
import Head from 'next/head';
import '../css/styles.css';
import '../css/diagnosis.css';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Stellavia - 魂の進化を導く占星体験</title>
        <meta name="description" content="Stellaviaは魂の進化をサポートする占星術の新しいアプローチを提供します。自己探求と成長のためのツールとしての占星術を体験してください。" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600&family=Montserrat:wght@300;400;500&display=swap" rel="stylesheet" />
      </Head>
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
