import { Route, Routes } from "react-router-dom";
import "./App.css";
import Navbar from "./components/Navbar";
import ProblemList from "./pages/ProblemList/ProblemList";
import ProblemPage from "./pages/Problem/Problem";
import ChooseAccountPage from "./pages/ChooseAccount/ChooseAccountPage.tsx";

import { Toaster } from "react-hot-toast";
import Test from "./Test";
function App() {
  return (
    <div className="h-[100vh]">
      <Toaster position="top-right" />

      <Navbar />
      <Routes>
        <Route path="/" element={<ProblemList />} />
        <Route path="/test" element={<Test />} />
        <Route path="/choose-account" element={<ChooseAccountPage />} />

        <Route path="/problem/:id" element={<ProblemPage />} />
      </Routes>
    </div>
  );
}

export default App;
