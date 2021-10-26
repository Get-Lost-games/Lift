import type { AppProps } from "next/app";
import { MDXProvider, MDXProviderComponentsProp } from "@mdx-js/react";
import "../styles/reset.css";
import "../styles/playground.css";
import "../styles/prism.css";
import "../../../tokens.css";

const components: MDXProviderComponentsProp = {
  wrapper: (props) => (
    <div
      style={{
        marginInline: "auto",
        width: "min(800px, 100%)",
        paddingInline: 16,
        fontFamily: "arial",
      }}
    >
      <main {...props} />
    </div>
  ),
};

function App({ Component, pageProps }: AppProps) {
  return (
    <MDXProvider components={components}>
      <Component {...pageProps} />
    </MDXProvider>
  );
}
export default App;
