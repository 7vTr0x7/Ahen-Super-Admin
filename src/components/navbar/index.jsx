import React from "react";
import { Link, useNavigate } from "react-router-dom";
import Dropdown from "components/dropdown";
import toast from "react-hot-toast";

const Navbar = (props) => {
  const { onOpenSidenav, brandText } = props;
  const navigate = useNavigate();
  const handleLogout = async () => {
    const token = localStorage.getItem("adminToken"); // Retrieve the stored token

    if (!token) {
      toast.error("No token found. Please log in first.");
      return;
    }

    try {
      // Send a request to the logout API
      const response = await fetch(
        "https://driving.shellcode.cloud/api/admin/logout",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`, // Send the token in the Authorization header
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();
      if (!response.ok) {
        toast.error(data.message || "Logout failed. Please try again.");
        return;
      }

      // Remove items from localStorage
      localStorage.removeItem("adminToken");
      localStorage.removeItem("adminRole");
      localStorage.removeItem("pageAccess");
      localStorage.removeItem("adminEmail"); // If you stored email as an example

      // Navigate to sign-in page
      navigate("/auth/sign-in");
    } catch (error) {
      console.error("Error:", error);
      toast.error("Something went wrong. Please try again.");
    }
  };

  return (
    <nav className="sticky top-4 z-40 flex flex-row flex-wrap items-center justify-between rounded-xl bg-white/10 p-2 backdrop-blur-xl dark:bg-[#0b14374d]">
      <div className="ml-[6px]">
        <div className="h-6 w-[224px] pt-1">
          <a
            className="text-sm font-normal text-navy-700 hover:underline dark:text-white dark:hover:text-white"
            href=" "
          >
            Pages
            <span className="mx-1 text-sm text-navy-700 hover:text-navy-700 dark:text-white">
              {" "}
              /{" "}
            </span>
          </a>
          <Link
            className="text-sm font-normal capitalize text-navy-700 hover:underline dark:text-white dark:hover:text-white"
            to="#"
          >
            {brandText}
          </Link>
        </div>
        <p className="shrink text-[33px] capitalize text-navy-700 dark:text-white">
          <Link
            to="#"
            className="font-bold capitalize hover:text-navy-700 dark:hover:text-white"
          >
            {brandText}
          </Link>
        </p>
      </div>

      <div className="relative mt-[3px] flex h-[61px] w-auto flex-grow items-center justify-around gap-5 rounded-full bg-white px-10 py-2 shadow-xl shadow-shadow-500 dark:!bg-navy-800 dark:shadow-none md:w-auto md:flex-grow-0 md:gap-1 xl:w-auto xl:gap-2">
        {/* Profile & Dropdown */}
        <Dropdown
          button={
            <img
              className="h-10 w-10 rounded-full"
              src={"https://placehold.co/400"}
              alt="Elon Musk"
            />
          }
          children={
            <div className="flex w-56 flex-col justify-start rounded-[20px] bg-white bg-cover bg-no-repeat shadow-xl shadow-shadow-500 dark:!bg-navy-700 dark:text-white dark:shadow-none">
              <div className="p-4">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-bold text-navy-700 dark:text-white">
                    👋 Hey,
                  </p>{" "}
                </div>
              </div>
              <div className="h-px w-full bg-gray-200 dark:bg-white/20 " />

              <div className="flex flex-col p-4">
                <button
                  onClick={handleLogout}
                  className="mt-3 text-sm font-medium text-red-500 transition duration-150 ease-out hover:text-red-500 hover:ease-in"
                >
                  Log Out
                </button>
              </div>
            </div>
          }
          classNames={"py-2 top-8 -left-[180px] w-max"}
        />
      </div>
    </nav>
  );
};

export default Navbar;
