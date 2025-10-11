import { useEffect, useState } from "react";
import { redirect, useNavigate } from "react-router-dom";
import { fetchUsers } from "./userApi";
import { User } from "./userType";

const ChooseAccountPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const data = await fetchUsers();
        setUsers(data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    loadUsers();
  }, []);

  const handleChooseUser = (user: User) => {
    sessionStorage.setItem("activeUser", JSON.stringify(user));
    navigate('/') // Redirect after choosing
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-bl from-black via-gray-900 to-blue-900 text-white px-4">
      <h1 className="text-3xl sm:text-4xl mb-10 font-semibold text-center">
        Who&apos;s coding?
      </h1>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 w-full max-w-4xl">
        {users.map((user) => (
          <div
            key={user._id}
            onClick={() => handleChooseUser(user)}
            className="flex flex-col items-center cursor-pointer transform hover:scale-105 transition-transform duration-200"
          >
            <img
              src={
                user.imageUrl ||
                `https://ui-avatars.com/api/?name=${user.username}&background=random`
              }
              alt={user.username}
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-lg mb-2 border-2 border-gray-500 
                     hover:border-blue-400 hover:shadow-lg hover:shadow-blue-500/40 transition-all duration-300"
            />
            <p className="text-sm sm:text-base md:text-lg font-medium">
              {user.username}
            </p>
          </div>
        ))}
      </div>
    </div>

  );
};

export default ChooseAccountPage;
