import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../hooks/useUser";
import {Home} from "lucide-react"
interface ActiveUser {
  _id: string;
  username: string;
  imageUrl?: string;
}

function Navbar() {
  const [activeUser, setActiveUser] = useState<ActiveUser | null>(null);
  const navigate = useNavigate();
  const { user, logout } = useUser();

  // Load user from sessionStorage on mount
  useEffect(() => {
    console.log(user)
    setActiveUser(user);
  }, [user]);

  

  return (
    <div className="navbar bg-gradient-to-r from-gray-900 via-blue-950 to-black h-[55px]">
      {/* Left */}
      <div className="navbar-start">
        <Home
        onClick={() => navigate('/')}
        className="cursor-pointer text-blue-500 hover:text-cyan-400 transition-colors duration-200"
        />
      </div>

      {/* Center */}
      <div className="navbar-center">
        <a
         className="
          relative inline-block text-2xl font-extrabold 
          bg-gradient-to-r from-blue-500 via-cyan-400 to-green-500 
          bg-[length:200%_200%] bg-clip-text text-transparent 
          transition-all duration-500 ease-in-out
          hover:bg-right-bottom hover:brightness-110
        "
          >
        AlgoCode
        </a>
      </div>

      {/* Right */}
      <div className="navbar-end">
        {/* Profile Avatar */}
        <div className="dropdown dropdown-end">
          <div
            tabIndex={0}
            role="button"
            className="btn btn-ghost btn-circle avatar"
          >
            <div className="w-10 rounded-full border border-gray-400">
              <img
                alt="User avatar"
                src={
                  activeUser?.imageUrl ||
                  `https://ui-avatars.com/api/?name=${
                    activeUser?.username 
                  }&background=random`
                }
              />
            </div>
          </div>

          {/* Dropdown Menu */}
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
          >
            <li>
              <span className="justify-between">
                <strong>{activeUser?.username || "Guest"}</strong>
              </span>
            </li>
            <li>
              <button onClick={() => navigate("/choose-account")}>
                Choose account{" "}
              </button>
            </li>
            <li>
              <button onClick={logout}>Logout</button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
