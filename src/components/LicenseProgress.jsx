import React, { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";

const LicenseProgress = () => {
  const [licenseType, setLicenseType] = useState("learning");
  const [userId, setUserId] = useState("");
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(false);

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

 const getNextStepButton = () => {
   if (!progress) return null;

   switch (progress.status) {
     case "processing":
       return licenseType === "learning" ? (
         <button
           onClick={() =>
             updateProgress("test_failed", {
               application_id: "APP123",
               test_password: "test123",
               test_link: "https://test.example.com",
             })
           }
           className="w-full rounded bg-blue-500 p-2 text-white hover:bg-blue-600"
         >
           Set Up Test
         </button>
       ) : null;

     case "test_failed":
       return licenseType === "driving" ? (
         <button
           onClick={() =>
             updateProgress("slot_booked", {
               slot_datetime: new Date().toISOString(),
               retest_fee_paid: true,
             })
           }
           className="w-full rounded bg-orange-500 p-2 text-white hover:bg-orange-600"
         >
           Rebook Slot
         </button>
       ) : null;

     case "slot_booked":
       return (
         <button
           onClick={() =>
             updateProgress("test_pending", {
               instructor_details: {
                 name: "John Doe",
                 image: "instructor_image_url",
                 vehicle_no: "MH-12-AB-1234",
                 destination: "Test Center A",
               },
             })
           }
           className="w-full rounded bg-yellow-500 p-2 text-white hover:bg-yellow-600"
         >
           Assign Instructor
         </button>
       );

     case "test_pending":
       return (
         <button
           onClick={() => updateProgress("test_passed")}
           className="w-full rounded bg-green-500 p-2 text-white hover:bg-green-600"
         >
           Mark as Passed
         </button>
       );

     case "test_passed":
       return licenseType === "learning" ? (
         <button
           onClick={() =>
             updateProgress("license_ready", {
               license_download_link: "https://example.com/license.pdf",
             })
           }
           className="w-full rounded bg-green-500 p-2 text-white hover:bg-green-600"
         >
           Set License Ready
         </button>
       ) : (
         <button
           onClick={() =>
             updateProgress("dispatched", { tracking_id: "TRACK123456" })
           }
           className="w-full rounded bg-blue-500 p-2 text-white hover:bg-blue-600"
         >
           Dispatch License
         </button>
       );

     case "license_ready":
       return (
         <a
           href={progress.license_download_link}
           target="_blank"
           className="w-full rounded bg-purple-500 p-2 text-white hover:bg-purple-600"
         >
           Download License
         </a>
       );

     case "dispatched":
       return (
         <button
           onClick={() => updateProgress("delivered")}
           className="w-full rounded bg-purple-500 p-2 text-white hover:bg-purple-600"
         >
           Mark as Delivered
         </button>
       );

     case "delivered":
       return (
         <span className="block rounded bg-gray-300 p-2 text-center text-gray-700">
           License Delivered ✅
         </span>
       );

     default:
       return null;
   }
 };


  return (
    <div className="mx-auto mt-10 max-w-xl rounded-lg bg-white p-6 shadow-lg">
      <Toaster />
      <h2 className="mb-4 text-2xl font-bold text-gray-800">
        License Progress
      </h2>
      <label className="block font-medium text-gray-600">
        Select License Type
      </label>
      <select
        value={licenseType}
        onChange={(e) => setLicenseType(e.target.value)}
        className="mb-4 w-full rounded border p-2"
      >
        <option value="learning">Learning License</option>
        <option value="driving">Driving License</option>
      </select>
      <label className="block font-medium text-gray-600">User ID</label>
      <input
        type="text"
        value={userId}
        onChange={(e) => setUserId(e.target.value)}
        className="mb-4 w-full rounded border p-2"
        placeholder="Enter User ID"
      />
      <button
        onClick={fetchProgress}
        className="w-full rounded bg-blue-500 p-2 text-white hover:bg-blue-600"
        disabled={loading}
      >
        {loading ? "Loading..." : "Fetch Progress"}
      </button>
      {progress && (
        <div className="mt-6 rounded bg-gray-100 p-4">
          <h3 className="text-xl font-bold">
            Current Status: {progress.status}
          </h3>
          {getNextStepButton()}
        </div>
      )}
    </div>
  );
};

export default LicenseProgress;
