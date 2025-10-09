import React from "react";
import AceEditor from "react-ace";

// Ace core
import "ace-builds/src-noconflict/ace";

// Only import modes you need
import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/mode-python";
import "ace-builds/src-noconflict/mode-java";
import "ace-builds/src-noconflict/mode-c_cpp";

// Only import themes you need
import "ace-builds/src-noconflict/theme-monokai";
import "ace-builds/src-noconflict/theme-github";

// Only language tools (no split/diff)
import "ace-builds/src-noconflict/ext-language_tools";

// Types
export type Language = "javascript" | "python" | "java" | "c_cpp";
export type Theme = "monokai" | "github";

interface ProblemPProps {
  language: Language;
  theme: Theme;
  code: string;
  setCode: (code: string) => void;
}

const ProblemP: React.FC<ProblemPProps> = ({ language, theme, code, setCode }) => {
  return (
    <div style={{ width: "100%", height: "100%" }}>
      <AceEditor
        mode={language}
        theme={theme}
        value={code}
        onChange={setCode}
        name="codeEditor"
        width="100%"
        height="100%"
        editorProps={{ $blockScrolling: true }}
        setOptions={{
          enableBasicAutocompletion: true,
          enableLiveAutocompletion: true,
          showLineNumbers: true,
          fontSize: 16,
        }}
      />
    </div>
  );
};

export default ProblemP;
