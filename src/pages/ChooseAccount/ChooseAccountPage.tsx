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
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white">
      <h1 className="text-4xl mb-10 font-semibold">Who&apos;s coding?</h1>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
        {users.map((user) => (
          <div
            key={user._id}
            onClick={() => handleChooseUser(user)}
            className="flex flex-col items-center cursor-pointer hover:scale-105 transition-transform"
          >
            <img
              src={
                user.imageUrl ||
                `https://ui-avatars.com/api/?name=${user.username}&background=random`
              }
              alt={user.username}
              className="w-24 h-24 rounded-md mb-2 border-2 border-gray-500 hover:border-white"
            />
            <p className="text-lg">{user.username}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChooseAccountPage;
