import React, { createContext, useState, useEffect } from "react";

import allRoutes from "../routes";
export const RoutesContext = createContext();

export const RoutesProvider = ({ children }) => {
  const [filteredRoutes, setFilteredRoutes] = useState([]);
  const [userType, setUserType] = useState(null); // Used to trigger re-render

  const updateRoutes = () => {
    const vendorId = localStorage.getItem("vendorId");
    const subadmin = localStorage.getItem("subadmin");

    let updatedRoutes = allRoutes; // Use allRoutes instead of importing routes

    if (subadmin) {
      try {
        const { page_access } = JSON.parse(subadmin);
        if (page_access) {
          const accessiblePaths = page_access
            .split(",")
            .map((path) => path.trim().replace(/_/g, "-"));

          updatedRoutes = allRoutes.filter((route) =>
            accessiblePaths.includes(route.path)
          );
        }
      } catch (error) {
        console.error("Error parsing subadmin data:", error);
      }
    }

    if (vendorId) {
      updatedRoutes = updatedRoutes.filter((route) => route.name !== "Sign In");
    }

    setFilteredRoutes(updatedRoutes);
    setUserType(vendorId ? "vendor" : subadmin ? "subadmin" : null); // Trigger re-render
  };

  useEffect(() => {
    updateRoutes();
    window.addEventListener("storage", updateRoutes); // Listen for storage changes
    return () => window.removeEventListener("storage", updateRoutes);
  }, []);

  return (
    <RoutesContext.Provider value={{ filteredRoutes, updateRoutes }}>
      {children}
    </RoutesContext.Provider>
  );
};
