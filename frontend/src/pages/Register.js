import React, { useContext } from "react";
import AuthContext from "../context/AuthContext";

function Register() {
  const { login } = useContext(AuthContext);

  const handleRegister = () => {
    // Fake user data (later connect to backend API)
    login({ name: "Student User" });
  };

  return (
    <div className="page">
      <h2>Sign Up</h2>
      <button onClick={handleRegister}>Register (fake)</button>
    </div>
  );
}

export default Register;
