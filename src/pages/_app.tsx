import { AppCacheProvider } from '@mui/material-nextjs/v15-pagesRouter'
import type { AppProps } from 'next/app'

export default function MyApp({ Component, pageProps }: AppProps) {
   return (
    <AppCacheProvider>
        <Component {...pageProps} />
    </AppCacheProvider>
   );
 }