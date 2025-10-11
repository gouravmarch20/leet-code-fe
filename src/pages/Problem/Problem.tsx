import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import DOMPurify from "dompurify";
import toast from "react-hot-toast";
import Editor from "@monaco-editor/react";

import Languages from "../../constants/Languages";
import Themes from "../../constants/Themes";
import { useSocket } from "../../hooks/useSocket";
import { ProblemData } from "../../types/problem.types";
import { useUser } from "../../hooks/useUser";

const { user } = useUser();
const USER_ID = user?.username || "GOURAV_1";
const submissionUrl = import.meta.env.VITE_SUBMISSION_SERVICE;
const socketUrl = import.meta.env.VITE_SOCKET_SERVICE;

function ProblemDescription() {
  const { id } = useParams<{ id: string }>();
  const [problem, setProblem] = useState<ProblemData | null>(null);
  const [activeTab, setActiveTab] = useState("statement");
  const [leftWidth, setLeftWidth] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const [language, setLanguage] = useState("javascript");
  const [code, setCode] = useState("");
  const [theme, setTheme] = useState("vs-dark");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [submissions, setSubmissions] = useState<any[]>([]);
  const [isLoadingSubs, setIsLoadingSubs] = useState(false);

  const fetchSubmissions = async () => {
    if (!problem?._id) return;
    setIsLoadingSubs(true);
    try {
      const res = await axios.post(
        `${submissionUrl}/api/v1/submissions/problem`,
        {
          userId: USER_ID,
          problemId: problem._id,
        }
      );
      if (res.data.success) {
        setSubmissions(res.data.data);
      } else {
        setSubmissions([]);
      }
    } catch (error) {
      console.error("Error fetching submissions:", error);
      toast.error("Failed to load submissions!");
    } finally {
      setIsLoadingSubs(false);
    }
  };

  const { submissionData, setSubmissionData } = useSocket(
    socketUrl,
    USER_ID,
    setIsSubmitting
  );

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

  // Fill editor with language-specific starter code
  useEffect(() => {
    if (!problem || !problem.codeStubs) return;
    const stub = problem.codeStubs.find(
      (s: any) => s.language.toLowerCase() === language.toLowerCase()
    );
    if (stub) setCode(stub.startSnippet + stub.endSnippet);
  }, [language, problem]);

  const handleSubmission = async () => {
    if (!problem) return;
    setIsSubmitting(true);
    setSubmissionData(null);

    try {
      await axios.post(`${submissionUrl}/api/v1/submissions`, {
        code,
        language,
        userId: USER_ID,
        problemId: problem._id,
      });
      toast.success("Submission sent!");
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
  const stopDragging = () => setIsDragging(false);
  const onDrag = (e: React.DragEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    const newLeft = (e.clientX / window.innerWidth) * 100;
    if (newLeft > 10 && newLeft < 90) setLeftWidth(newLeft);
  };

  if (!problem) return <div className="text-white p-4">Loading problem...</div>;

  const sanitizedMarkdown = DOMPurify.sanitize(problem.description || "");

  return (
    <div
      className="flex w-screen h-[calc(100vh-57px)]"
      onMouseMove={onDrag}
      onMouseUp={stopDragging}
    >
      {/* SOCKET RESULT / CONSOLE */}

      {/* LEFT PANEL */}
      <div
        className="leftPanel h-full overflow-auto bg-gradient-to-tl bg-gray-900"
        style={{ width: `${leftWidth}%` }}
      >
        <div
          role="tablist"
          className="tabs bg-transparent border-blue-400 border tabs-boxed w-3/5"
        >
          <a
            onClick={() => setActiveTab("statement")}
            role="tab"
            className={`tab ${activeTab === "statement" ? "bg-blue-500" : ""}
            transition-colors duration-300
            `}
          >
            Problem Statement
          </a>
          <a
            onClick={() => {
              setActiveTab("submissions");
              fetchSubmissions();
            }}
            role="tab"
            className={`tab ${activeTab === "submissions" ? "bg-blue-600" : ""}
            transition-colors duration-300
            `}
          >
            Submissions
          </a>
        </div>

        <div className="markdownViewer p-5">
          {activeTab === "statement" ? (
            <ReactMarkdown rehypePlugins={[rehypeRaw]} className="prose">
              {sanitizedMarkdown}
            </ReactMarkdown>
          ) : (
            <div>
              {isLoadingSubs ? (
                <p className="text-sm text-gray-400">Loading submissions...</p>
              ) : submissions.length === 0 ? (
                <p className="text-gray-400">No submissions found.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="table table-zebra text-sm">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Status</th>
                        <th>Language</th>
                        <th>Submitted At</th>
                      </tr>
                    </thead>
                    <tbody>
                      {submissions.map((sub, idx) => (
                        <tr key={sub._id}>
                          <td>{idx + 1}</td>
                          <td>
                            <span
                              className={`font-semibold ${
                                sub.status === "COMPLETED"
                                  ? "text-green-500"
                                  : sub.status === "Pending"
                                  ? "text-yellow-500"
                                  : "text-red-500"
                              }`}
                            >
                              {sub.status}
                            </span>
                          </td>
                          <td>{sub.language}</td>
                          <td>
                            {new Date(
                              sub.createdAt || Date.now()
                            ).toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
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
        {/* Top Controls */}
        <div className="flex gap-x-1.5 justify-start items-center px-4 py-2">
          <button className="btn btn-success btn-sm" onClick={handleSubmission}>
            Submit
          </button>

          <select
            className="select select-info select-sm max-w-xs"
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
            className="select select-info select-sm max-w-xs"
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

        {/* Code Editor */}
        <div className=" flex flex-col h-[80vh]">
          <Editor
            defaultLanguage={language}
            language={language}
            value={code}
            onChange={(v) => setCode(v || "")}
            theme={theme}
            options={{
              automaticLayout: true,
              fontSize: 16,
              minimap: { enabled: false },
            }}
          />
        </div>
        {/* code status  */}

        <div className="bg-gradient-to-r from-orange-800 to-orange-600 text-white mt-3 rounded-lg p-4 shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              🖥️ Console
            </h3>
          </div>

          {/* Loader while waiting */}
          {isSubmitting && !submissionData && (
            <div className="flex flex-col items-center justify-center py-4">
              <div className="w-10 h-10 border-4 border-white border-t-transparent rounded-full animate-spin mb-3"></div>
              <p className="text-sm opacity-80">Evaluating your code...</p>
            </div>
          )}

          {/* Show socket response */}
          {!isSubmitting && submissionData && (
            <div className="animate-fadeIn">
              <p>
                <strong>Status:</strong>{" "}
                <span
                  className={
                    submissionData.status === "COMPLETED"
                      ? "text-green-400"
                      : "text-red-400"
                  }
                >
                  {submissionData.status}
                </span>
              </p>
              <p className="mt-1">
                <strong>Output:</strong>{" "}
                <span className="text-yellow-200">
                  {submissionData.output || "N/A"}
                </span>
              </p>
            </div>
          )}

          {/* Idle state */}
          {!isSubmitting && !submissionData && (
            <p className="opacity-60 text-sm">No submissions yet</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProblemDescription;
