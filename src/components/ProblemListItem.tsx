import { useNavigate } from "react-router-dom";
import { ProblemData } from "../types/problem.types";
interface ProblemListItemProps {
  problem: ProblemData;
}

export default function ProblemListItem({ problem }: ProblemListItemProps) {
  const navigate = useNavigate();
  return (
    <div
      key={problem._id}
      className="p-5 rounded-2xl bg-white/10 shadow-blue-500 shadow-sm hover:shadow-md
      hover:shadow-blue-500/70
      transition-color duration-150"
    >
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-lg md:text-xl font-semibold">{problem.title}</h2>
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
          className="px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-500 transition-colors duration-200"
          onClick={() => navigate(`/problem/${problem._id}`)} // ✅ redirect
        >
          Solve →
        </button>
      </div>
    </div>
  );
}
