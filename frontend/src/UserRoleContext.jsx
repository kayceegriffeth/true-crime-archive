import { createContext, useContext, useState, useEffect } from "react";

const UserRoleContext = createContext();

export function UserRoleProvider({ children }) {
  const [role, setRole] = useState(localStorage.getItem("role") || "USER");

  useEffect(() => {
    localStorage.setItem("role", role);
  }, [role]);

  /** Switch to ADMIN = load admin account */
  function switchToAdmin() {
    const username = "testuser";   // <- your ROLE_ADMIN user in DB
    const password = "password";

    localStorage.setItem("role", "ADMIN");
    localStorage.setItem("username", username);
    localStorage.setItem("password", password);

    setRole("ADMIN");
  }

  /** Switch to USER = clear stored credentials */
  function switchToUser() {
    localStorage.setItem("role", "USER");
    localStorage.removeItem("username");
    localStorage.removeItem("password");

    setRole("USER");
  }

  /** The toggle used by NavBar */
  function toggleRole() {
    if (role === "ADMIN") {
      switchToUser();
    } else {
      switchToAdmin();
    }

    // reload so fetch calls immediately use updated credentials
    window.location.reload();
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
