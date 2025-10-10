import { useEffect, useState } from "react";
import { ProblemData } from "../../types/problem.types";
import ProblemListItem from "../../components/ProblemListItem";
import Dropdown from "../../components/Dropdown";
import SearchBar from "../../components/SearchBar";

function ProblemList() {
  const [problems, setProblems] = useState<ProblemData[]>([]);
  const [filter, setFilter] = useState<string>("none");
  const [searchWord, setSearchWord] = useState<string>("");
  const PROBLEM_SERVICE = import.meta.env.VITE_PROBLEM_SERVICE;


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

  function onFilterChange(difficulty: string) {
    setFilter(difficulty);
  }
  function onSearchBarChange(searchWord:string) {

      setSearchWord(searchWord)

  }
  

  return (
    // <h3>dd</h3>
    <div className="flex justify-center items-start w-screen min-h-screen bg-gray-900 text-white py-10">
      <div className="topic-list flex flex-col w-[70%] gap-4">

        <h1 className="text-2xl font-bold mb-4 text-center">Problem List</h1>

        <div className="flex flex-row justify-end gap-8 items-center">
          <SearchBar onChange={onSearchBarChange} value={searchWord}/>
          <Dropdown label="Select difficulty" options={["easy", "medium", "hard", "none"]} value={filter} onChange={onFilterChange} />
        </div>

        {problems.length === 0 ? (
          <div className="text-center text-gray-400">Loading problems...</div>
        ) : (
          problems
            .filter((problem) => filter === "none" || problem.difficulty === filter)
            .filter((problem) => problem.title.toLowerCase().includes(searchWord.toLowerCase()))
            .map((problem) => (
              <ProblemListItem key={problem._id} problem={problem} />
            ))
        )}
      </div>
    </div>
  );
}

export default ProblemList;
