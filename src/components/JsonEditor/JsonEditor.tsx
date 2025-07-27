"use client";

import Editor from "@monaco-editor/react";
import { useTheme } from "next-themes";

import { JsonEditorProps } from "./JsonEditor.types";

export const JsonEditor = ({ height = "80.75vh", value }: JsonEditorProps) => {
  const { resolvedTheme } = useTheme();

  return (
    <Editor
      defaultLanguage="json"
      height={height}
      value={JSON.stringify(value ?? {}, null, 2)}
      theme={resolvedTheme === "dark" ? "vs-dark" : "light"}
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
