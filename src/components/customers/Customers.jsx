import React, { useState, useEffect } from "react";

const Customers = () => {
  const [adminRole, setAdminRole] = useState("");
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const customersPerPage = 6;

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  useEffect(() => {
    const storedAdminRole = localStorage.getItem("adminRole");
    if (storedAdminRole) {
      setAdminRole(storedAdminRole);
    } else {
      setError("Admin role not found in localStorage.");
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (!adminRole) return;

      setLoading(true);
      setError(null);

      try {
        const token = localStorage.getItem("adminToken");
        const headers = {
          Authorization: `Bearer ${token}`,
        };

        let drivingLicenseResponse = null;
        let learningLicenseResponse = null;

        // Fetch driving license customers if the role allows
        if (adminRole === "admin" || adminRole === "sub-admin") {
          drivingLicenseResponse = await fetch(
            "https://driving.shellcode.cloud/api/admin/getDrivingLicenseCustomers/1",
            { headers }
          );
          learningLicenseResponse = await fetch(
            "https://driving.shellcode.cloud/api/admin/getLearningLicenseCustomers/1",
            { headers }
          );
        }

        const drivingData = await drivingLicenseResponse.json();
        const learningData = await learningLicenseResponse.json();

        if (
          drivingData.message ===
            "Driving license customers retrieved successfully" &&
          learningData.message ===
            "Learning license customers retrieved successfully"
        ) {
          const combinedCustomers = [
            ...drivingData.customers,
            ...learningData.customers,
          ];
          setCustomers(combinedCustomers);
        } else {
          setCustomers([]);
          setError("No data found for this admin role.");
        }
      } catch (err) {
        setError("Failed to fetch data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [adminRole]);

  const indexOfLastCustomer = currentPage * customersPerPage;
  const indexOfFirstCustomer = indexOfLastCustomer - customersPerPage;
  const currentCustomers = customers.slice(
    indexOfFirstCustomer,
    indexOfLastCustomer
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const closeModal = () => setSelectedCustomer(null);

  return (
    <div className="mt-10">
      {loading && <div className="text-center text-indigo-500">Loading...</div>}
      {error && <div className="text-center text-red-500">{error}</div>}

      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {currentCustomers.map((customer) => (
          <div
            key={customer.id}
            className="cursor-pointer rounded-lg border border-gray-200 bg-white p-6 shadow-lg transition-shadow duration-300 hover:shadow-xl"
            onClick={() => setSelectedCustomer(customer)}
          >
            <h3 className="text-xl font-semibold text-gray-800">
              {customer.first_name} {customer.last_name}
            </h3>
            <p className="text-sm text-gray-600">ID: {customer.id}</p>
            <p className="text-sm text-gray-600">
              Mobile: {customer.mobile_number}
            </p>
            <p className="text-sm text-gray-600">
              License Type: {customer.license_type}
            </p>
          </div>
        ))}
      </div>

      {customers.length > customersPerPage && (
        <div className="mt-8 flex justify-center space-x-4">
          {Array.from({
            length: Math.ceil(customers.length / customersPerPage),
          }).map((_, index) => (
            <button
              key={index + 1}
              onClick={() => paginate(index + 1)}
              className={`rounded-md px-4 py-2 text-white ${
                currentPage === index + 1
                  ? "bg-indigo-600"
                  : "bg-indigo-500 hover:bg-indigo-600"
              }`}
            >
              {index + 1}
            </button>
          ))}
        </div>
      )}

      {selectedCustomer && (
        <div
          className="bg-black fixed inset-0 z-50 flex items-center justify-center bg-opacity-50"
          onClick={closeModal}
        >
          <div
            className="scrollbar-thin scrollbar-thumb-gray-400 relative max-h-screen w-11/12 max-w-4xl overflow-y-auto rounded-lg bg-gray-200 p-8 shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute right-2 top-2 text-2xl text-gray-600 hover:text-gray-800"
              onClick={closeModal}
            >
              ✕
            </button>
            <h2 className="mb-6 text-2xl font-bold text-gray-800">
              {selectedCustomer.first_name} {selectedCustomer.last_name}
            </h2>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {Object.entries(selectedCustomer).map(([key, value]) => {
                if (key.includes("photo")) {
                  return (
                    <div key={key} className="flex flex-col items-center">
                      <span className="mb-2 font-semibold capitalize">
                        {key.replace(/_/g, " ")}:
                      </span>
                      <img
                        src={value}
                        alt={key}
                        className="h-40 w-40 rounded-lg object-cover shadow-md"
                      />
                    </div>
                  );
                } else if (key.includes("date") || key === "created_at") {
                  return (
                    <div key={key}>
                      <span className="font-semibold capitalize">
                        {key.replace(/_/g, " ")}:
                      </span>{" "}
                      <span>{formatDate(value)}</span>
                    </div>
                  );
                }
                return (
                  <div key={key}>
                    <span className="font-semibold capitalize">
                      {key.replace(/_/g, " ")}:
                    </span>{" "}
                    <span>{value}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Customers;
