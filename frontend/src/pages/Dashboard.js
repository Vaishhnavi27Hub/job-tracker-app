import React, { useContext } from "react";
import AuthContext from "../context/AuthContext";

function Dashboard() {
  const { user, logout } = useContext(AuthContext);

  return (
    <div className="page">
      <h2>Welcome, {user?.name}</h2>
      <p>This is your job tracker dashboard 🚀</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
}

export default Dashboard;
