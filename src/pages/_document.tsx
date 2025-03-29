import * as React from 'react';
import { Html, Head, Main, NextScript } from 'next/document'
import {
    DocumentHeadTags,
    documentGetInitialProps,
} from '@mui/material-nextjs/v15-pagesRouter';


export default function Document(props) {
  return (
    <Html lang="en" itemScope itemType="http://schema.org/WebPage" prefix="og: http://ogp.me/ns#">
      <Head>
        <script async src="https://inform.everyone.wtf/legal.min.js" data-site-id="0822e697-d6b8-4d0c-9eff-7aa2f3365df1"></script>
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}

Document.getInitialProps = async (ctx) => {
  const finalProps = await documentGetInitialProps(ctx);
  return finalProps;
};