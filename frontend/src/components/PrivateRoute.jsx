import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const PrivateRoute = () => {
  const { user } = useSelector((state) => state.userReducer);
  return user ? <Outlet /> : <Navigate to={"/sign-in"} />;
};

export default PrivateRoute;
