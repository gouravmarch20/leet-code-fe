import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../hooks/useUser";
interface ActiveUser {
  _id: string;
  username: string;
  imageUrl?: string;
}

function Navbar() {
  const [activeUser, setActiveUser] = useState<ActiveUser | null>(null);
  const navigate = useNavigate();
  const { user, logout } = useUser();
  console.log("dfsad" , user)
  // Load user from sessionStorage on mount
  useEffect(() => {
    const storedUser = sessionStorage.getItem("activeUser");
    if (storedUser) {
      setActiveUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem("activeUser");
    navigate("/choose-account");
  };

  return (
    <div className="navbar bg-base-100 border-b-2 h-[55px]">
      {/* Left */}
      <div className="navbar-start"></div>

      {/* Center */}
      <div className="navbar-center">
        <a className="btn btn-ghost text-xl">AlgoCode</a>
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
                    activeUser?.username || "User"
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
