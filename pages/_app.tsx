import type { AppProps } from 'next/app';
import '../css/styles.css';
import '../css/diagnosis.css';

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}
