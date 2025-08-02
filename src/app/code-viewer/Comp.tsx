"use client";

import { useRef, useState } from "react";

import Editor, { OnMount } from "@monaco-editor/react";
import * as monacoEditor from "monaco-editor";

export function AutoResizeMonaco({ autoWidth, value }: { value: string; autoWidth?: boolean }) {
  const editorRef = useRef<monacoEditor.editor.IStandaloneCodeEditor | null>(null);
  const [height, setHeight] = useState<number>(100);
  const [isFocused, setIsFocused] = useState(false);

  const handleEditorDidMount: OnMount = (editor, monaco: typeof monacoEditor) => {
    editorRef.current = editor;

    const updateHeight = () => {
      const contentHeight = editor.getContentHeight();
      setHeight(contentHeight < 300 ? 300 : contentHeight);
      editor.layout();
    };

    updateHeight();
    editor.onDidContentSizeChange(updateHeight);
    editor.onDidFocusEditorWidget(() => setIsFocused(true));
    editor.onDidBlurEditorWidget(() => setIsFocused(false));

    // Disable Monaco's default wheel handling
    const domNode = editor.getDomNode();
    if (domNode) {
      domNode.style.borderRadius = "14px"; // ✅ Rounds Monaco itself
      domNode.style.overflow = "hidden"; // Prevents inner overflow from poking out
      domNode.addEventListener(
        "wheel",
        (e) => {
          // Let scroll bubble to page
          if (!e.ctrlKey) {
            e.stopPropagation();
          }
        },
        { passive: true }
      );
    }
  };

  return (
    <div
      className={`rounded-md transition-all ${isFocused ? "rounded-md border border-blue-500 shadow-[0_0_8px_#3b82f6]/30 ring-1 ring-blue-500/30 transition hover:ring-blue-500/60" : "border border-transparent"}`}
      style={{ height, overflow: "visible" }}
    >
      <Editor
        width={autoWidth ? "100%" : "500px"}
        language="json"
        value={value}
        theme="vs-dark"
        options={{
          readOnly: false,
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          automaticLayout: true,
          folding: true,
          wordWrap: "on", // ❗ Important to allow horizontal scrolling
          padding: { top: 12, bottom: 12 },
          scrollbar: {
            vertical: "hidden",
            handleMouseWheel: false,
          },
        }}
        onMount={handleEditorDidMount}
      />
    </div>
  );
}
