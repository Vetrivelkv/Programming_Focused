import { Check, Copy } from "lucide-react";
import { useState } from "react";
import { Highlight, themes } from "prism-react-renderer";

export default function CodeBlock({ children }) {
  const [copied, setCopied] = useState(false);
  const code = children?.props?.children ?? "";
  const className = children?.props?.className ?? "";
  const language = className.replace("language-", "") || "text";
  const prismLanguage = {
    bash: "bash", html: "markup", js: "javascript", json: "json",
    jsx: "jsx", sh: "bash", ts: "typescript", tsx: "tsx",
  }[language] || language;
  const cleanCode = String(code).replace(/\n$/, "");

  const copyCode = async () => {
    await navigator.clipboard.writeText(cleanCode);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  };

  return (
    <div className="markdown-code-block">
      <div className="markdown-code-toolbar">
        <span>{language}</span>
        <button type="button" onClick={copyCode} aria-label="Copy code snippet">
          {copied ? <Check /> : <Copy />}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <Highlight theme={themes.nightOwl} code={cleanCode} language={prismLanguage}>
        {({ className: highlightedClass, style, tokens, getLineProps, getTokenProps }) => (
          <pre className={`${highlightedClass} numbered-code`} style={style}>
            <code>
              {tokens.map((line, lineIndex) => (
                <span key={lineIndex} {...getLineProps({ line, className: "code-line" })}>
                  <span className="code-line-number" aria-hidden="true">{lineIndex + 1}</span>
                  <span className="code-line-content">
                    {line.map((token, tokenIndex) => (
                      <span key={tokenIndex} {...getTokenProps({ token })} />
                    ))}
                  </span>
                </span>
              ))}
            </code>
          </pre>
        )}
      </Highlight>
    </div>
  );
}
