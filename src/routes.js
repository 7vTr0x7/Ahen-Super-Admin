// Admin Imports
import MainDashboard from "views/admin/default";
import Profile from "views/admin/profile";
import DataTables from "views/admin/tables";
import DrivingLicense from "./components/DrivingLicense/PageOne";
import LearningLicense from "./components/LearningLicense/PageOne";

// Auth Imports
import SignIn from "views/auth/SignIn";

// Icon Imports
import { MdBarChart, MdHome, MdLock, MdPerson } from "react-icons/md";
import DrivingCustomers from "components/customers/DrivingCustomers";
import LearningCustomers from "components/customers/LearningCutomers";
import SubAdmins from "components/SubAdmins";

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
    name: "Driving Customers",
    layout: "/admin",
    path: "driving-customer",
    icon: <MdPerson className="h-6 w-6" />,
    component: <DrivingCustomers />,
  },

  {
    name: "Driving License",
    layout: "/admin",
    path: "driving-license",
    icon: <MdPerson className="h-6 w-6" />,
    component: <DrivingLicense />,
  },
  {
    name: "Learning License",
    layout: "/admin",
    path: "learning-license",
    icon: <MdPerson className="h-6 w-6" />,
    component: <LearningLicense />,
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

/// Filter the routes based on the presence of vendorId or subadmin
const vendorId = localStorage.getItem("vendorId");
const subadmin = localStorage.getItem("subadmin");

let filteredRoutes = allRoutes;

if (subadmin) {
  try {
    const { page_access } = JSON.parse(subadmin);

    if (page_access) {
      const accessiblePaths = page_access
        .split(",")
        .map((path) => path.trim().replace(/_/g, "-"));

      filteredRoutes = allRoutes.filter((route) =>
        accessiblePaths.includes(route.path)
      );
    }
  } catch (error) {
    console.error("Error parsing subadmin data:", error);
  }
}

const routes = vendorId
  ? filteredRoutes.filter((route) => route.name !== "Sign In")
  : allRoutes;

export default routes;
