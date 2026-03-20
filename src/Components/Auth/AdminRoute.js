import { useContext } from "react";
import { Redirect, Route } from "react-router-dom";
import { AuthContext } from "../../contextStore/AuthContext";

const AdminRoute = ({ children, ...rest }) => {

  const { user } = useContext(AuthContext);

  const adminEmail = "vedantchaudhai10@gmail.com";

  return (
    <Route
      {...rest}
      render={() =>
        user && user.email === adminEmail ? (
          children
        ) : (
          <Redirect to="/" />
        )
      }
    />
  );
};

export default AdminRoute;
