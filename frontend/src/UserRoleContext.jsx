import React from "react";
import { createContext, useContext, useState, useEffect } from "react";

const UserRoleContext = createContext();

export function UserRoleProvider({ children }) {
  const [role, setRole] = useState(localStorage.getItem("role") || "USER");

  useEffect(() => {
    localStorage.setItem("role", role);
  }, [role]);


  function switchToAdmin() {
    const username = "testuser";   
    const password = "password";

    localStorage.setItem("role", "ADMIN");
    localStorage.setItem("username", username);
    localStorage.setItem("password", password);

    setRole("ADMIN");
  }

  function switchToUser() {
    localStorage.setItem("role", "USER");
    localStorage.removeItem("username");
    localStorage.removeItem("password");

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

  if (!window.location.reload) {
    window.location.reload = () => {};
  }
  
  return (
    <UserRoleContext.Provider value={{ role, toggleRole }}>
      {children}
    </UserRoleContext.Provider>
  );
}

export function useUserRole() {
  return useContext(UserRoleContext);
}
