import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Toaster } from "react-hot-toast";
import { RoutesContext } from "components/RoutesProvider";

export default function Auth() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    phone: "",
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
      ? "https://driving.shellcode.cloud/vendor/signup"
      : "https://driving.shellcode.cloud/vendor/login";

    const payload = {
      email: formData.email,
      password: formData.password,
      ...(isSignUp && { phone: formData.phone }), // Include phone only during signup
    };

    console.log("Payload:", payload); // Debugging log

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
        localStorage.setItem("vendorData", JSON.stringify(formData));
        toggleAuthMode();
      } else {
        if (data.vendorId || data.subadmin) {
          toast.success("Login successful!");
          if (data.subadmin) {
            localStorage.setItem("subadmin", JSON.stringify(data.subadmin));
          }
          localStorage.setItem(
            "vendorId",
            data.vendorId || data.subadmin.vendor_id
          );
          localStorage.setItem("token", data.token);
          updateRoutes();
          navigate("/");
          window.location.reload(); // Ensure routes update immediately
        }
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
            ? "Create an account by entering your email, phone number, and password!"
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
            className="mt-2 flex h-12 w-full items-center justify-center rounded-xl border border-gray-200 bg-white/0 p-3 text-sm outline-none dark:!border-white/10 dark:text-white"
          />
        </div>

        {isSignUp && (
          /* Phone Input */
          <div className="mb-3">
            <label
              htmlFor="phone"
              className="ml-1.5 text-sm font-medium text-navy-700 dark:text-white"
            >
              Phone*
            </label>
            <input
              id="phone"
              type="text"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="Enter your phone number"
              className="mt-2 flex h-12 w-full items-center justify-center rounded-xl border border-gray-200 bg-white/0 p-3 text-sm outline-none dark:!border-white/10 dark:text-white"
            />
          </div>
        )}

        {/* Password Input */}
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
            className="mt-2 flex h-12 w-full items-center justify-center rounded-xl border border-gray-200 bg-white/0 p-3 text-sm outline-none dark:!border-white/10 dark:text-white"
          />
        </div>

        <button
          onClick={handleSubmit}
          className="linear mt-2 w-full rounded-xl bg-brand-500 py-[12px] text-base font-medium text-white transition duration-200 hover:bg-brand-600 active:bg-brand-700 dark:bg-brand-400 dark:text-white dark:hover:bg-brand-300 dark:active:bg-brand-200"
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
