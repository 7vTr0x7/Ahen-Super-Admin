import React, { useState, useEffect } from "react";

const SubAdmins = () => {
  const [subAdmins, setSubAdmins] = useState([]);
  const [newSubAdmin, setNewSubAdmin] = useState({
    name: "",
    email: "",
    password: "",
    mobileNumber: "",
    pageAccess: [],
  });

  const pageAccessOptions = ["notification", "dashboard"];

  const handleCreateSubAdmin = async (e) => {
    e.preventDefault();

    const superAdminId = localStorage.getItem("super-admin-id"); // Get super-admin-id from localStorage

    if (!superAdminId) {
      console.error("Super Admin ID is missing in local storage.");
      return;
    }

    try {
      const response = await fetch(
        "https://driving.shellcode.cloud/api/admin/signup",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: newSubAdmin.email,
            password: newSubAdmin.password,
            role: "sub-admin", // Always set role as sub-admin
            mobile_number: newSubAdmin.mobileNumber,
            page_access: newSubAdmin.pageAccess,
            super_admin_id: superAdminId, // Add super-admin-id here
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Error creating sub-admin");
      }

      // Optionally, fetch the updated list of sub-admins after creation
      fetchSubAdmins();

      // Reset form after submission
      setNewSubAdmin({
        name: "",
        email: "",
        password: "",
        mobileNumber: "",
        pageAccess: [],
      });
    } catch (error) {
      console.error("Error creating sub-admin:", error);
    }
  };

  const togglePageAccess = (page) => {
    setNewSubAdmin((prev) => ({
      ...prev,
      pageAccess: prev.pageAccess.includes(page)
        ? prev.pageAccess.filter((access) => access !== page)
        : [...prev.pageAccess, page],
    }));
  };

  const fetchSubAdmins = async () => {
    const superAdminId = localStorage.getItem("super-admin-id"); // Get super-admin-id from localStorage

    if (!superAdminId) {
      console.error("Super Admin ID is missing in local storage.");
      return;
    }

    try {
      const response = await fetch(
        "https://driving.shellcode.cloud/api/admin/subadmins/count"
      );
      if (!response.ok) {
        throw new Error("Error fetching sub-admins count");
      }
      const data = await response.json();
      setSubAdmins(data.subadminDetails); // Assuming response includes the sub-admin details
    } catch (error) {
      console.error("Error fetching sub-admins:", error);
    }
  };

  useEffect(() => {
    fetchSubAdmins(); // Fetch sub-admins on component mount
  }, []);

  return (
    <div className="mx-auto max-w-4xl p-4">
      <h2 className="mb-6 text-2xl font-semibold text-gray-800">Sub Admins</h2>

      <h3 className="mt-6 text-xl font-semibold text-gray-700">
        Create Sub Admin
      </h3>
      <form onSubmit={handleCreateSubAdmin} className="space-y-4">
        <input
          type="text"
          placeholder="Name"
          value={newSubAdmin.name}
          onChange={(e) =>
            setNewSubAdmin({ ...newSubAdmin, name: e.target.value })
          }
          className="w-full rounded-md border border-gray-300 p-2"
        />
        <input
          type="email"
          placeholder="Email"
          value={newSubAdmin.email}
          onChange={(e) =>
            setNewSubAdmin({ ...newSubAdmin, email: e.target.value })
          }
          className="w-full rounded-md border border-gray-300 p-2"
        />
        <input
          type="password"
          placeholder="Password"
          value={newSubAdmin.password}
          onChange={(e) =>
            setNewSubAdmin({ ...newSubAdmin, password: e.target.value })
          }
          className="w-full rounded-md border border-gray-300 p-2"
        />
        <input
          type="text"
          placeholder="Mobile Number"
          value={newSubAdmin.mobileNumber}
          onChange={(e) =>
            setNewSubAdmin({ ...newSubAdmin, mobileNumber: e.target.value })
          }
          className="w-full rounded-md border border-gray-300 p-2"
        />
        <h4 className="font-semibold text-gray-700">Page Access</h4>
        <div className="flex space-x-4">
          {pageAccessOptions.map((page) => (
            <label key={page} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={newSubAdmin.pageAccess.includes(page)}
                onChange={() => togglePageAccess(page)}
                className="h-4 w-4 text-blue-500"
              />
              <span>{page}</span>
            </label>
          ))}
        </div>
        <button
          type="submit"
          className="w-full rounded-md bg-green-500 p-2 text-white"
        >
          Create Sub Admin
        </button>
      </form>

      <h3 className="mt-6 text-xl font-semibold text-gray-700">
        Sub Admin List
      </h3>
      {subAdmins?.length === 0 ? (
        <p className="text-gray-500">
          No sub-admins found for this super admin.
        </p>
      ) : (
        <ul className="space-y-2">
          {subAdmins?.length > 0 &&
            subAdmins?.map((admin) => (
              <li
                key={admin.id}
                className="rounded-md bg-gray-100 p-4 shadow-md"
              >
                <p className="font-semibold text-gray-700">{admin.name}</p>
                <p className="text-gray-600">{admin.email}</p>
                <p className="text-gray-600">
                  Page Access:{" "}
                  {Array.isArray(admin.page_access)
                    ? admin.page_access.join(", ")
                    : admin.page_access}
                </p>
              </li>
            ))}
        </ul>
      )}
    </div>
  );
};

export default SubAdmins;
