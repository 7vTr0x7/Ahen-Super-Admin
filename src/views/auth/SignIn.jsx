import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { RoutesContext } from "components/RoutesProvider";

export default function Auth() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    mobile_number: "",
    role: "admin",
    page_access: [],
  });
  const navigate = useNavigate();
  const { updateRoutes } = useContext(RoutesContext);

  const toggleAuthMode = () => setIsSignUp((prev) => !prev);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

 const handleSubmit = async () => {
   const url = isSignUp
     ? "https://driving.shellcode.cloud/api/admin/signup"
     : "https://driving.shellcode.cloud/api/admin/login";

   const payload = {
     email: formData.email,
     password: formData.password,
     ...(isSignUp && {
       mobile_number: formData.mobile_number,
       role: formData.role,
       ...(formData.role === "sub-admin" && {
         page_access: formData.page_access,
       }),
     }),
   };

   try {
     const response = await fetch(url, {
       method: "POST",
       headers: {
         "Content-Type": "application/json",
       },
       credentials: "include",
       body: JSON.stringify(payload),
     });

     const data = await response.json();
     if (!response.ok) {
       toast.error(data.message || "Something went wrong");
       return;
     }

     if (isSignUp) {
       toast.success("Signup successful! Please log in.");
       toggleAuthMode();
     } else {
       toast.success("Login successful!");
       // Store token and role in localStorage
       localStorage.setItem("adminToken", data.token);
       localStorage.setItem("super-admin-id", data.id);
       localStorage.setItem("adminRole", data.role);

       // If the role is 'sub-admin', store page access if available
       if (data.role === "sub-admin") {
         localStorage.setItem("pageAccess", JSON.stringify(data.page_access));
       }

       // You can also save the email or ID if you need it for session purposes
       localStorage.setItem("adminEmail", data.email); // Example if needed

       updateRoutes();
       navigate("/"); // Navigate to the desired route after login
       window.location.reload(); // Reload to reflect changes
     }
   } catch (error) {
     console.error("Error:", error);
     toast.error("Something went wrong. Please try again.");
   }
 };


  return (
    <div className="mb-16 mt-16 flex h-full w-full items-center justify-center px-2 md:mx-0 md:px-0 lg:mb-10 lg:items-center lg:justify-start">
      <div className="mt-[10vh] w-full max-w-full flex-col items-center md:pl-4 lg:pl-0 xl:max-w-[420px]">
        <h4 className="mb-2.5 text-4xl font-bold text-navy-700 dark:text-white">
          {isSignUp ? "Sign Up" : "Sign In"}
        </h4>
        <p className="mb-9 ml-1 text-base text-gray-600">
          {isSignUp
            ? "Create an account by entering your email, mobile number, and password!"
            : "Enter your email and password to sign in!"}
        </p>

        {/* Email Input */}
        <div className="mb-3">
          <label
            htmlFor="email"
            className="ml-1.5 text-sm font-medium text-navy-700 dark:text-white"
          >
            Email*
          </label>
          <input
            id="email"
            type="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="mail@example.com"
            className="mt-2 flex h-12 w-full rounded-xl border border-gray-200 p-3 text-sm dark:border-white/10 dark:text-white"
          />
        </div>

        {isSignUp && (
          <>
            <div className="mb-3">
              <label
                htmlFor="mobile_number"
                className="ml-1.5 text-sm font-medium text-navy-700 dark:text-white"
              >
                Mobile Number*
              </label>
              <input
                id="mobile_number"
                type="text"
                value={formData.mobile_number}
                onChange={handleInputChange}
                placeholder="Enter your mobile number"
                className="mt-2 flex h-12 w-full rounded-xl border border-gray-200 p-3 text-sm dark:border-white/10 dark:text-white"
              />
            </div>
            <div className="mb-3">
              <label
                htmlFor="role"
                className="ml-1.5 text-sm font-medium text-navy-700 dark:text-white"
              >
                Role*
              </label>
              <select
                id="role"
                value={formData.role}
                onChange={handleInputChange}
                className="mt-2 flex h-12 w-full rounded-xl border border-gray-200 p-3 text-sm dark:border-white/10 dark:text-white"
              >
                <option value="admin">Admin</option>
                <option value="sub-admin">Sub-Admin</option>
              </select>
            </div>
          </>
        )}

        <div className="mb-3">
          <label
            htmlFor="password"
            className="ml-1.5 text-sm font-medium text-navy-700 dark:text-white"
          >
            Password*
          </label>
          <input
            id="password"
            type="password"
            value={formData.password}
            onChange={handleInputChange}
            placeholder="Min. 8 characters"
            className="mt-2 flex h-12 w-full rounded-xl border border-gray-200 p-3 text-sm dark:border-white/10 dark:text-white"
          />
        </div>

        <button
          onClick={handleSubmit}
          className="linear mt-2 w-full rounded-xl bg-brand-500 py-3 text-base font-medium text-white transition duration-200 hover:bg-brand-600 dark:bg-brand-400 dark:hover:bg-brand-300"
        >
          {isSignUp ? "Sign Up" : "Sign In"}
        </button>

        <div className="mt-4 text-center">
          <span className="text-sm font-medium text-navy-700 dark:text-gray-600">
            {isSignUp ? "Already have an account?" : "Not registered yet?"}
          </span>
          <button
            onClick={toggleAuthMode}
            className="ml-1 text-sm font-medium text-brand-500 hover:text-brand-600 dark:text-white"
          >
            {isSignUp ? "Sign In" : "Create an account"}
          </button>
        </div>
      </div>
      <Toaster />
    </div>
  );
}
