import { useParams } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import DOMPurify from "dompurify";
import toast from "react-hot-toast";

import Languages from "../../constants/Languages";
import Themes from "../../constants/Themes";
import { useSocket } from "../../hooks/useSocket";
import { ProblemData } from "../../types/problem.types";
import Editor from "@monaco-editor/react";

const USER_ID = "GOURAV_1";
const submissionUrl = import.meta.env.VITE_SUBMISSION_SERVICE;
const socketUrl = import.meta.env.VITE_SOCKET_SERVICE;

function ProblemDescription() {
  const { id } = useParams<{ id: string }>();
  const [problem, setProblem] = useState<ProblemData | null>(null);
  const [activeTab, setActiveTab] = useState("statement");
  const [testCaseTab, setTestCaseTab] = useState("input");
  const [leftWidth, setLeftWidth] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const [language, setLanguage] = useState("javascript");
  const [code, setCode] = useState("");
  const [theme, setTheme] = useState("vs-dark"); // Monaco themes: "vs-dark", "vs", "hc-black"

  useSocket(socketUrl, USER_ID);

  // Fetch problem
  useEffect(() => {
    if (!id) return;

    const fetchProblem = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_PROBLEM_SERVICE}/problems/${id}`
        );
        const data = await res.json();
        if (data.success) setProblem(data.data);
      } catch (err) {
        console.error("Error fetching problem:", err);
      }
    };

    fetchProblem();
  }, [id]);

  // Fill code editor based on language
  useEffect(() => {
    if (!problem || !problem.codeStubs) return;

    const selectedStub = problem.codeStubs.find(
      (stub: any) => stub.language.toLowerCase() === language.toLowerCase()
    );

    if (selectedStub) {
      setCode(selectedStub.startSnippet + selectedStub.endSnippet);
    }
  }, [language, problem]);

  const handleSubmission = async () => {
    if (!problem) return;
    try {
      const response = await axios.post(`${submissionUrl}/api/v1/submissions`, {
        code,
        language,
        userId: USER_ID,
        problemId: problem._id,
      });
      toast.success("Submission sent!");
      return response;
    } catch (error) {
      console.error(error);
      toast.error("Submission failed!");
    }
  };

  // Drag functions
  const startDragging = (e: React.DragEvent<HTMLDivElement>) => {
    setIsDragging(true);
    e.preventDefault();
  };
  const stopDragging = () => isDragging && setIsDragging(false);
  const onDrag = (e: React.DragEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    const newLeftWidth = (e.clientX / window.innerWidth) * 100;
    if (newLeftWidth > 10 && newLeftWidth < 90) setLeftWidth(newLeftWidth);
  };

  const isActiveTab = (tabName: string) =>
    activeTab === tabName ? "tab tab-active" : "tab";
  const isInputTabActive = (tabName: string) =>
    testCaseTab === tabName ? "tab tab-active" : "tab";

  if (!problem) return <div className="text-white p-4">Loading problem...</div>;

  const sanitizedMarkdown = DOMPurify.sanitize(problem.description || "");
  const testCases = problem.testCases || [];

  return (
    <div
      className="flex w-screen h-[calc(100vh-57px)]"
      onMouseMove={onDrag}
      onMouseUp={stopDragging}
    >
      {/* LEFT PANEL */}
      <div
        className="leftPanel h-full overflow-auto"
        style={{ width: `${leftWidth}%` }}
      >
        <div role="tablist" className="tabs tabs-boxed w-3/5">
          <a
            onClick={() => setActiveTab("statement")}
            role="tab"
            className={isActiveTab("statement")}
          >
            Problem Statement
          </a>
          <a
            onClick={() => setActiveTab("editorial")}
            role="tab"
            className={isActiveTab("editorial")}
          >
            Editorial
          </a>
          <a
            onClick={() => setActiveTab("submissions")}
            role="tab"
            className={isActiveTab("submissions")}
          >
            Submissions
          </a>
        </div>

        <div className="markdownViewer p-[20px] basis-1/2">
          <ReactMarkdown rehypePlugins={[rehypeRaw]} className="prose">
            {sanitizedMarkdown}
          </ReactMarkdown>
        </div>
      </div>

      {/* DRAG DIVIDER */}
      <div
        className="divider cursor-col-resize w-[5px] bg-slate-200 h-full"
        onMouseDown={startDragging}
      />

      {/* RIGHT PANEL */}
      <div
        className="rightPanel h-full overflow-auto flex flex-col"
        style={{ width: `${100 - leftWidth}%` }}
      >
        {/* Top controls */}
        <div className="flex gap-x-1.5 justify-start items-center px-4 py-2 basis-[5%]">
          <button className="btn btn-success btn-sm" onClick={handleSubmission}>
            Submit
          </button>

          <select
            className="select select-info w-full select-sm max-w-xs"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
          >
            {Languages.map((lang: any) => (
              <option key={lang.value} value={lang.value}>
                {lang.languageName}
              </option>
            ))}
          </select>

          <select
            className="select select-info w-full select-sm max-w-xs"
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
          >
            {Themes.map((th: any) => (
              <option key={th.value} value={th.value}>
                {th.themeName}
              </option>
            ))}
          </select>
        </div>

        {/* Code editor */}
        <div className="flex flex-col editor-console grow-[1]">
          <Editor
            height="100%"
            defaultLanguage={language}
            language={language}
            value={code}
            onChange={(value) => setCode(value || "")}
            theme={theme}
            options={{
              automaticLayout: true,
              fontSize: 16,
              minimap: { enabled: false },
            }}
          />

          {/* Test cases */}
          <div className="collapse bg-base-200 rounded-none mt-2">
            <input type="checkbox" className="peer" />
            <div className="collapse-title bg-primary text-primary-content peer-checked:bg-secondary peer-checked:text-secondary-content">
              Console
            </div>
            <div className="collapse-content bg-primary text-primary-content peer-checked:bg-secondary peer-checked:text-secondary-content">
              <div role="tablist" className="tabs tabs-boxed w-3/5 mb-4">
                <a
                  onClick={() => setTestCaseTab("input")}
                  role="tab"
                  className={isInputTabActive("input")}
                >
                  Input
                </a>
                <a
                  onClick={() => setTestCaseTab("output")}
                  role="tab"
                  className={isInputTabActive("output")}
                >
                  Output
                </a>
              </div>

              {testCaseTab === "input" ? (
                <div className="space-y-2">
                  {testCases.map((t) => (
                    <div
                      key={t._id}
                      className="bg-neutral text-white rounded-md p-2"
                    >
                      <strong>Input:</strong> {t.input}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-2">
                  {testCases.map((t) => (
                    <div
                      key={t._id}
                      className="bg-neutral text-white rounded-md p-2"
                    >
                      <strong>Expected Output:</strong> {t.output}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProblemDescription;
