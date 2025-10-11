import { Navigate, Outlet } from "react-router-dom";


interface ProtectedRouteProps {
    redirectTo: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
    redirectTo,
}) => {
    if (sessionStorage.getItem("activeUser") == null) {
        console.log("returned")
        return <Navigate to={redirectTo} replace />;
    }

    return <Outlet />; // renders the nested route content
};

export default ProtectedRoute;
