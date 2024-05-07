import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const OnlyAdminPrivateRoute = () => {
  const { user } = useSelector((state) => state.userReducer);
  return user && user.isAdmin ? <Outlet /> : <Navigate to={"/dashboard"} />;
};

export default OnlyAdminPrivateRoute;
