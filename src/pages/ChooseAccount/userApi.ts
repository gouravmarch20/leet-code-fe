import axios from "axios";
import { User } from "./userType";

const BASE_URL = import.meta.env.VITE_PROBLEM_SERVICE ;

export const fetchUsers = async (): Promise<User[]> => {
  const res = await axios.get(`${BASE_URL}/user/list`);
  return res.data.data;
};
