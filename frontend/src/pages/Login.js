import React, { useContext } from "react";
import AuthContext from "../context/AuthContext";

function Login() {
  const { login } = useContext(AuthContext);

  const handleLogin = () => {
    login({ name: "Student User" });
  };

  return (
    <div className="page">
      <h2>Login</h2>
      <button onClick={handleLogin}>Login (fake)</button>
    </div>
  );
}

export default Login;
