import { Route, Routes } from "react-router-dom";
import "./App.css";
import Navbar from "./components/Navbar";
import SideBar from "./components/SideBar";
import ProblemList from "./pages/ProblemList/ProblemList";
import ProblemPage from "./pages/Problem/Problem";
import { Toaster } from "react-hot-toast";
import Test from "./Test";
function App() {
  return (
    <div className="h-[100vh] overflow-hidden">
      <Toaster position="top-right" />

      <Navbar />
      <SideBar />
      <Routes>
        <Route path="/" element={<ProblemList />} />
        <Route path="/test" element={<Test />} />

        <Route path="/problem/:id" element={<ProblemPage />} />
      </Routes>
    </div>
  );
}

export default App;
