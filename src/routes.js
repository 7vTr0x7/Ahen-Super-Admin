// Admin Imports
import MainDashboard from "views/admin/default";
import DrivingLicense from "./components/DrivingLicense/PageOne";
import LearningLicense from "./components/LearningLicense/PageOne";

// Auth Imports
import SignIn from "views/auth/SignIn";

// Icon Imports
import Customers from "components/customers/Customers";
import SubAdmins from "components/SubAdmins";
import { MdHome, MdLock, MdPerson } from "react-icons/md";
import ListOfPayments from "components/ListOfPayments";
import LicenseProgress from "components/LicenseProgress";
import Notifications from "components/Notifications";

// Initial routes array
const allRoutes = [
  {
    name: "Main Dashboard",
    layout: "/admin",
    path: "default",
    icon: <MdHome className="h-6 w-6" />,
    component: <MainDashboard />,
  },
  {
    name: "Customers",
    layout: "/admin",
    path: "customers",
    icon: <MdPerson className="h-6 w-6" />,
    component: <Customers />,
  },

  {
    name: "License Progress",
    layout: "/admin",
    path: "license-progress",
    icon: <MdPerson className="h-6 w-6" />,
    component: <LicenseProgress />,
  },
  {
    name: "List Of Payments",
    layout: "/admin",
    path: "list-payments",
    icon: <MdPerson className="h-6 w-6" />,
    component: <ListOfPayments />,
  },
  {
    name: "Purchased Courses",
    layout: "/admin",
    path: "purchased-courses",
    icon: <MdPerson className="h-6 w-6" />,
    component: <ListOfPayments />,
  },
  {
    name: "Notifications",
    layout: "/admin",
    path: "notifications",
    icon: <MdPerson className="h-6 w-6" />,
    component: <Notifications />,
  },
  {
    name: "Sub Admins",
    layout: "/admin",
    path: "sub-admins",
    icon: <MdPerson className="h-6 w-6" />,
    component: <SubAdmins />,
  },
  {
    name: "Sign In",
    layout: "/auth",
    path: "sign-in",
    icon: <MdLock className="h-6 w-6" />,
    component: <SignIn />,
  },
];

// Get the current user's role and page access from localStorage or your app state (e.g., Redux or context)
const adminToken = localStorage.getItem("adminToken");
const adminRole = localStorage.getItem("adminRole");
const pageAccess = localStorage.getItem("pageAccess");

let filteredRoutes = allRoutes;

if (adminRole === "sub-admin" && pageAccess) {
  try {
    const parsedPageAccess = JSON.parse(pageAccess);

    if (parsedPageAccess) {
      const accessiblePaths = parsedPageAccess
        .split(",")
        .map((path) => path.trim().replace(/_/g, "-"));

      filteredRoutes = allRoutes.filter((route) =>
        accessiblePaths.includes(route.path)
      );
    }
  } catch (error) {
    console.error("Error parsing sub-admin page access:", error);
  }
}

// Show routes for logged-in admins and remove the "Sign In" route
const routes = adminToken
  ? filteredRoutes.filter((route) => route.name !== "Sign In")
  : allRoutes;

export default routes;
