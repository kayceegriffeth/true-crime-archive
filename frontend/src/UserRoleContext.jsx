import React, { createContext, useContext, useState, useEffect } from "react";

const UserRoleContext = createContext();

export function UserRoleProvider({ children }) {
  const [role, setRole] = useState(localStorage.getItem("role") || "USER");

  // USER mode = demo user with ID = 3 (truecrimefan)
  // ADMIN mode = admin user with ID = 1 
  const userId = role === "ADMIN" ? 1 : 3;

  useEffect(() => {
    localStorage.setItem("role", role);
  }, [role]);

  function switchToAdmin() {
    localStorage.setItem("role", "ADMIN");
    setRole("ADMIN");
  }

  function switchToUser() {
    localStorage.setItem("role", "USER");
    setRole("USER");
  }

  function toggleRole() {
    if (role === "ADMIN") {
      switchToUser();
    } else {
      switchToAdmin();
    }
    window.location.reload();
  }

  return (
    <UserRoleContext.Provider value={{ role, userId, toggleRole }}>
      {children}
    </UserRoleContext.Provider>
  );
}

export function useUserRole() {
  return useContext(UserRoleContext);
}
