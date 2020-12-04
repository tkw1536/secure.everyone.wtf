import * as React from 'react';
import Document, { Html, Head, Main, NextScript } from 'next/document'
import Container from 'muicss/lib/react/container';

export default class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx)
    return { ...initialProps }
  }

  render() {
    return (
      <Html lang="en" itemScope itemType="http://schema.org/WebPage" prefix="og: http://ogp.me/ns#">
        <Head>
          <script async src="https://inform.everyone.wtf/legal.min.js" data-site-id="0822e697-d6b8-4d0c-9eff-7aa2f3365df1"></script>
        </Head>
        <body>
          <div>
            <Container>
              <Main />
            </Container>
          </div>
          <NextScript />
        </body>
      </Html>
    )
  }
};
