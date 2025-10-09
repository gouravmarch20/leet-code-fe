import { useParams } from "react-router-dom";
import { useState, DragEvent, useEffect } from "react";

import axios from "axios";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";

import DOMPurify from "dompurify";
import Languages from "../../constants/Languages";
import Themes from "../../constants/Themes";
import ProblemP from "./ProblemP";

import { useSocket } from "../../hooks/useSocket";
import { ProblemData } from "../../types/problem.types";
import toast from "react-hot-toast";

type languageSupport = { languageName: string; value: string };
type themeStyle = { themeName: string; value: string };

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
  const [theme, setTheme] = useState("monokai");

  useSocket(socketUrl, USER_ID);

  // Fetch problem by ID
  useEffect(() => {
    toast.success("dfssa");

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

  // Fill code editor based on selected language
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
      console.log(response);
      return response;
    } catch (error) {
      console.log(error);
    }
  };

  // Drag functions
  const startDragging = (e: DragEvent<HTMLDivElement>) => {
    setIsDragging(true);
    e.preventDefault();
  };
  const stopDragging = () => isDragging && setIsDragging(false);
  const onDrag = (e: DragEvent<HTMLDivElement>) => {
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
            {Languages.map((lang: languageSupport) => (
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
            {Themes.map((th: themeStyle) => (
              <option key={th.value} value={th.value}>
                {th.themeName}
              </option>
            ))}
          </select>
        </div>

        {/* Code editor */}
        <div className="flex flex-col editor-console grow-[1]">
          <div className="editorContainer grow-[1]">
            <ProblemP
              language={language}
              theme={theme}
              code={code}
              setCode={setCode}
            />
          </div>

          {/* Test cases */}
          <div className="collapse bg-base-200 rounded-none">
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
