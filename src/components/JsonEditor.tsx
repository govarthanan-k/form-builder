"use client";

import Editor from "@monaco-editor/react";

export const JsonEditor = ({ height = "80.75vh", value }: { height?: string; value?: object }) => {
  const json = {
    name: "Gova",
    active: true,
    items: [1, 2, 3],
  };

  return (
    <Editor
      defaultLanguage="json"
      height={height}
      // defaultValue={}
      value={JSON.stringify(value ?? json, null, 2)}
      theme="vs-dark"
      options={{
        fontSize: 14,
        readOnly: false, // Set true if you want it locked
        automaticLayout: true, // Automatically resize on container changes
        minimap: { enabled: false }, // Disable minimap for a cleaner UI
        formatOnPaste: true,
        formatOnType: true,
        scrollBeyondLastLine: false,
        wordWrap: "on", // Wrap long lines
        wrappingIndent: "same",
        tabSize: 2,
        insertSpaces: true,
        lineNumbers: "on",
        folding: true,
        renderLineHighlight: "line",
        renderWhitespace: "none",
        showFoldingControls: "always",
        bracketPairColorization: { enabled: true },
        guides: {
          indentation: true,
          highlightActiveIndentation: true,
        },
      }}
    />
  );
};
