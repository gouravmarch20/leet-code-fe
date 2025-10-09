import { useEffect, useState } from "react";
import { ProblemData } from "../../types/problem.types";
import { useNavigate } from "react-router-dom";

function ProblemList() {
  const [problems, setProblems] = useState<ProblemData[]>([]);
  const PROBLEM_SERVICE = import.meta.env.VITE_PROBLEM_SERVICE;
  const navigate = useNavigate();  

  useEffect(() => {
    // Fetch problems from backend
    // console.log("PROBLEM_SERVICE" , PROBLEM_SERVICE + "/problems")

    const url = PROBLEM_SERVICE + "/problems";
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setProblems(data.data);
      })
      .catch((err) => console.error("Error fetching problems:", err));
  }, []);

  return (
    // <h3>dd</h3>
    <div className="flex justify-center items-start w-screen min-h-screen bg-gray-900 text-white py-10">
      <div className="topic-list flex flex-col w-[70%] gap-4">
        <h1 className="text-2xl font-bold mb-4 text-center">Problem List</h1>

        {problems.length === 0 ? (
          <div className="text-center text-gray-400">Loading problems...</div>
        ) : (
          problems.map((problem) => (
            <div
              key={problem._id}
              className="p-5 bg-gray-800 rounded-2xl shadow-md hover:shadow-lg hover:bg-gray-700 transition-all"
            >
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-xl font-semibold">{problem.title}</h2>
                <span
                  className={`px-3 py-1 text-sm rounded-full ${
                    problem.difficulty === "easy"
                      ? "bg-green-600"
                      : problem.difficulty === "medium"
                      ? "bg-yellow-600"
                      : "bg-red-600"
                  }`}
                >
                  {problem.difficulty}
                </span>
              </div>

              <p
                className="text-gray-300 text-sm leading-relaxed"
                dangerouslySetInnerHTML={{
                  __html: problem.description?.replace("\n", "<br/>"),
                }}
              />

              <div className="mt-3">
                <button
                  className="px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-500 transition"
                  onClick={() => navigate(`/problem/${problem._id}`)} // ✅ redirect
                >
                  Solve →
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default ProblemList;
