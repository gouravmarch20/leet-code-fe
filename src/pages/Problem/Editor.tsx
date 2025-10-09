import React from "react";
import Editor from "@monaco-editor/react";

interface ProblemEditorProps {
  language?: string;
  theme?: "vs" | "vs-dark" | "hc-black";
  code: string;
  setCode: (value: string) => void;
}

const ProblemEditor: React.FC<ProblemEditorProps> = ({
  language = "javascript",
  theme = "vs-dark",
  code,
  setCode,
}) => {
  return (
    <Editor
      height="100%"
      language={language}
      value={code}
      theme={theme}
      onChange={(value) => setCode(value || "")}
      options={{
        automaticLayout: true,
        fontSize: 16,
        minimap: { enabled: false },
        scrollBeyondLastLine: false,
      }}
    />
  );
};

export default ProblemEditor;
