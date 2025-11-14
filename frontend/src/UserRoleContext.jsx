import React, { createContext, useContext, useState } from "react";

const UserRoleContext = createContext();

export const UserRoleProvider = ({ children }) => {
  const [role, setRole] = useState("USER"); // USER or ADMIN

  const toggleRole = () => {
    setRole((prev) => (prev === "USER" ? "ADMIN" : "USER"));
  };

  return (
    <UserRoleContext.Provider value={{ role, toggleRole }}>
      {children}
    </UserRoleContext.Provider>
  );
};

export const useUserRole = () => useContext(UserRoleContext);
