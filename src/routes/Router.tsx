import { Route, Routes } from "react-router-dom";
import ProblemList from "../pages/ProblemList/ProblemList.tsx";
import ProblemPage from "../pages/Problem/Problem.tsx";


import ProtectedRoute from "./ProtectedRoutes.tsx";
import Test from "../Test.tsx";
import ChooseAccountPage from "../pages/ChooseAccount/ChooseAccountPage.tsx";
export default function Router() {
  return (
    <Routes >

      <Route path="/choose-account" element = {<ChooseAccountPage/>}/>
        <Route element = {
          <ProtectedRoute redirectTo="/choose-account" />}>
          <Route path="/" element={<ProblemList />} />
          <Route path="/problem/:id" element={<ProblemPage />} />
        </Route>
        <Route path="/test" element = {<Test/>}/>
      </Routes>
  )
}
