
import "./App.css";
import { Toaster } from "react-hot-toast";
import Navbar from "./components/Navbar";
import Router from "./routes/Router";

function App() {
  return (
    <div className="h-[100vh]">
      <Toaster position="top-right" />
      <Navbar />
      <Router/>
    </div>
  );
}

export default App;
