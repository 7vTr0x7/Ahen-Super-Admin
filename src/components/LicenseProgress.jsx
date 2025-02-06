import React, { useState } from "react";
import toast, { Toaster } from "react-hot-toast";

const LicenseProgress = () => {
  const [licenseType, setLicenseType] = useState("learning");
  const [userId, setUserId] = useState("");
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(false);
  const [inputFields, setInputFields] = useState({});

  const API_BASE = "https://driving.shellcode.cloud/api/progress";

  const fetchProgress = async () => {
    if (!userId) return toast.error("Please enter a user ID");
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/${licenseType}/${userId}`);
      if (!response.ok) throw new Error("Failed to fetch progress");
      const data = await response.json();
      setProgress(data.data || null);
      toast.success("Progress fetched successfully!");
    } catch (error) {
      toast.error(error.message);
      setProgress(null);
    }
    setLoading(false);
  };

  const updateProgress = async (status, additionalData = {}) => {
    if (!userId) return toast.error("Please enter a user ID");
    const requestData = { user_id: userId, status, ...additionalData };
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/${licenseType}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestData),
      });
      if (!response.ok) throw new Error("Failed to update progress");
      toast.success("Progress updated successfully!");
      fetchProgress();
    } catch (error) {
      toast.error(error.message);
    }
    setLoading(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInputFields({ ...inputFields, [name]: value });
  };

  const renderInputFields = () => {
    if (!progress) return null;

    switch (progress.status) {
      case "processing":
        return (
          <div className="space-y-4">
            <input
              type="text"
              name="application_id"
              placeholder="Application ID"
              value={inputFields.application_id || ""}
              onChange={handleInputChange}
              className="w-full rounded-lg border p-3"
            />
            <input
              type="text"
              name="test_password"
              placeholder="Test Password"
              value={inputFields.test_password || ""}
              onChange={handleInputChange}
              className="w-full rounded-lg border p-3"
            />
            <input
              type="text"
              name="test_link"
              placeholder="Test Link"
              value={inputFields.test_link || ""}
              onChange={handleInputChange}
              className="w-full rounded-lg border p-3"
            />
          </div>
        );

      case "slot_booked":
        return (
          <div className="space-y-4">
            <input
              type="datetime-local"
              name="slot_datetime"
              value={inputFields.slot_datetime || ""}
              onChange={handleInputChange}
              className="w-full rounded-lg border p-3"
            />
          </div>
        );

      case "test_pending":
        return (
          <div className="space-y-4">
            <input
              type="text"
              name="instructor_name"
              placeholder="Instructor Name"
              value={inputFields.instructor_name || ""}
              onChange={handleInputChange}
              className="w-full rounded-lg border p-3"
            />
            <input
              type="text"
              name="vehicle_no"
              placeholder="Vehicle Number"
              value={inputFields.vehicle_no || ""}
              onChange={handleInputChange}
              className="w-full rounded-lg border p-3"
            />
            <input
              type="text"
              name="destination"
              placeholder="Destination"
              value={inputFields.destination || ""}
              onChange={handleInputChange}
              className="w-full rounded-lg border p-3"
            />
          </div>
        );

      case "license_ready":
        return (
          <div className="space-y-4">
            <input
              type="text"
              name="license_download_link"
              placeholder="License Download Link"
              value={inputFields.license_download_link || ""}
              onChange={handleInputChange}
              className="w-full rounded-lg border p-3"
            />
          </div>
        );

      case "dispatched":
        return (
          <div className="space-y-4">
            <input
              type="text"
              name="tracking_id"
              placeholder="Tracking ID"
              value={inputFields.tracking_id || ""}
              onChange={handleInputChange}
              className="w-full rounded-lg border p-3"
            />
          </div>
        );

      default:
        return null;
    }
  };

  const getNextStepButton = () => {
    if (!progress) return null;

    switch (progress.status) {
      case "processing":
        return (
          <button
            onClick={() =>
              updateProgress("test_failed", {
                application_id: inputFields.application_id,
                test_password: inputFields.test_password,
                test_link: inputFields.test_link,
              })
            }
            className="w-full rounded-lg bg-blue-600 p-3 text-white hover:bg-blue-700"
          >
            Set Up Test
          </button>
        );

      case "test_failed":
        return (
          <button
            onClick={() =>
              updateProgress("slot_booked", {
                slot_datetime: inputFields.slot_datetime,
                retest_fee_paid: true,
              })
            }
            className="w-full rounded-lg bg-orange-600 p-3 text-white hover:bg-orange-700"
          >
            Rebook Slot
          </button>
        );

      case "slot_booked":
        return (
          <button
            onClick={() =>
              updateProgress("test_pending", {
                instructor_details: {
                  name: inputFields.instructor_name,
                  vehicle_no: inputFields.vehicle_no,
                  destination: inputFields.destination,
                },
              })
            }
            className="w-full rounded-lg bg-yellow-600 p-3 text-white hover:bg-yellow-700"
          >
            Assign Instructor
          </button>
        );

      case "test_pending":
        return (
          <button
            onClick={() => updateProgress("test_passed")}
            className="w-full rounded-lg bg-green-600 p-3 text-white hover:bg-green-700"
          >
            Mark as Passed
          </button>
        );

      case "test_passed":
        return (
          <button
            onClick={() =>
              updateProgress("license_ready", {
                license_download_link: inputFields.license_download_link,
              })
            }
            className="w-full rounded-lg bg-green-600 p-3 text-white hover:bg-green-700"
          >
            Set License Ready
          </button>
        );

      case "license_ready":
        return (
          <a
            href={progress.license_download_link}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full rounded-lg bg-purple-600 p-3 text-center text-white hover:bg-purple-700"
          >
            Download License
          </a>
        );

      case "dispatched":
        return (
          <button
            onClick={() => updateProgress("delivered")}
            className="w-full rounded-lg bg-purple-600 p-3 text-white hover:bg-purple-700"
          >
            Mark as Delivered
          </button>
        );

      case "delivered":
        return (
          <span className="block rounded-lg bg-gray-200 p-3 text-center text-gray-700">
            License Delivered ✅
          </span>
        );

      default:
        return null;
    }
  };

  return (
    <div className="mx-auto mt-10 max-w-xl rounded-xl bg-white p-8 shadow-xl">
      <Toaster />
      <h2 className="mb-6 text-xl font-bold">License Progress Tracker</h2>
      <div className="mb-4">
        <label>Select License Type</label>
        <select
          value={licenseType}
          onChange={(e) => setLicenseType(e.target.value)}
          className="mt-1 w-full border border-gray-300 p-2"
        >
          <option value="learning">Learning License</option>
          <option value="driving">Driving License</option>
        </select>
      </div>
      <div className="mb-4">
        <label>User ID</label>
        <input
          type="text"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          placeholder="Enter User ID"
          className="mt-1 w-full border border-gray-300 p-2"
        />
      </div>
      <button
        onClick={fetchProgress}
        disabled={loading}
        className="w-full bg-blue-600 p-2 text-white hover:bg-blue-700"
      >
        {loading ? "Loading..." : "Fetch Progress"}
      </button>

      {progress && (
        <div className="mt-6 rounded-md bg-gray-50 p-4">
          <h3>Current Status: {progress.status}</h3>
          {renderInputFields()}
          {getNextStepButton()}
        </div>
      )}
    </div>
  );
};

export default LicenseProgress;
