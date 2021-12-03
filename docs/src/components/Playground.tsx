import { PropsWithChildren, ReactElement, ReactNode } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import parserHtml from "prettier/parser-html";
import prettier from "prettier/standalone";
import Prism, { languages } from "prismjs";

type PlaygroundProps = {
  language?: string;
};

const jsxToCode = (jsx: ReactNode, language: string) => {
  const markup = renderToStaticMarkup(jsx as ReactElement);
  const pretty = `${prettier.format(markup, {
    parser: "html",
    plugins: [parserHtml],
  })}`;

  const highlighted = Prism.highlight(pretty, languages[language], language);
  return highlighted;
};

const Playground = ({
  children,
  language = "html",
}: PropsWithChildren<PlaygroundProps>) => {
  return (
    <div className="playground">
      <div className="playground-result">{children}</div>
      <pre className={`playground-code language-${language}`}>
        <code
          className={`prism language-${language}`}
          dangerouslySetInnerHTML={{ __html: jsxToCode(children, language) }}
        />
      </pre>
    </div>
  );
};

export default Playground;
