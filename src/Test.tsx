// import React, { useState } from "react";
// import AceEditor from "react-ace";

// // Core Ace
// import "ace-builds/src-noconflict/ace";

// // Modes (only what you need)
// import "ace-builds/src-noconflict/mode-javascript";
// import "ace-builds/src-noconflict/mode-python";
// import "ace-builds/src-noconflict/mode-java";
// import "ace-builds/src-noconflict/mode-c_cpp";

// // Themes (only what you need)
// import "ace-builds/src-noconflict/theme-monokai";
// import "ace-builds/src-noconflict/theme-github";

// // Autocomplete
// import "ace-builds/src-noconflict/ext-language_tools";

// // ⚠️ Prevent dynamic require of unsupported extensions
// if (typeof (window as any).acequire === "undefined") {
//   (window as any).acequire = (moduleName: string) => {
//     if (moduleName.startsWith("ace-builds/src-noconflict/ext-")) {
//       return {}; // noop for split/diff etc.
//     }
//     throw new Error(
//       `Dynamic require of "${moduleName}" is not supported in Vite`
//     );
//   };
// }

// const TestEditor: React.FC = () => {
//   const [code, setCode] = useState("// Start coding...");
//   const [language, setLanguage] = useState<"javascript" | "python">(
//     "javascript"
//   );
//   const [theme, setTheme] = useState<"monokai" | "github">("monokai");

//   return (
//     <div style={{ width: "100%", height: "500px" }}>
//       <AceEditor
//         mode={language}
//         theme={theme}
//         value={code}
//         onChange={setCode}
//         name="codeEditor"
//         width="100%"
//         height="100%"
//         editorProps={{ $blockScrolling: true }}
//         setOptions={{
//           enableBasicAutocompletion: true,
//           enableLiveAutocompletion: true,
//           showLineNumbers: true,
//           fontSize: 16,
//         }}
//       />
//     </div>
//   );
// };

// export default TestEditor;
import React from 'react'

const Test = () => {
  return (
    <div>Test</div>
  )
}

export default Test