import React, { useState, useEffect } from "react";
import { FaIdCard } from "react-icons/fa";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const PageOne = () => {
  const [step, setStep] = useState(1);
  const [vehicleType, setVehicleType] = useState("");
  const [uploads, setUploads] = useState({
    llPhoto: null,
  });
  const [price, setPrice] = useState(0);
  const [isPayed, setIsPayed] = useState(false);
  const navigate = useNavigate();

  // Fetch price dynamically
  useEffect(() => {
    const fetchPrice = async () => {
      try {
        const response = await fetch(
          "https://driving.shellcode.cloud/license/licenses/price"
        );
        const data = await response.json();
        if (response.ok && data?.data) {
          const drivingPrice = data.data.find(
            (item) => item.price_type === "driving_license_customer_price"
          );
          if (drivingPrice) {
            setPrice(parseFloat(drivingPrice.price));
          } else {
            toast.error("Price data not found.");
          }
        } else {
          toast.error("Failed to fetch price data.");
        }
      } catch (error) {
        toast.error("An error occurred while fetching price data.");
      }
    };

    fetchPrice();
  }, []);

  const handleFileUpload = (e, key) => {
    if (e.target.files && e.target.files[0]) {
      setUploads((prev) => ({ ...prev, [key]: e.target.files[0] }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!vehicleType || !uploads.llPhoto) {
      toast.error(
        "Please select a vehicle type and upload the required Learning License photo."
      );
      return;
    }

    const storedUserId = localStorage.getItem("vendorId");

    const formDataObj = new FormData();
    formDataObj.append("license_type", "driving");
    formDataObj.append("vehicle_type", vehicleType);
    formDataObj.append("LL_photo", uploads.llPhoto); // Appending the file
    formDataObj.append("payment_filed", price.toString());
    formDataObj.append("user_id", storedUserId);
    formDataObj.append("vendor_id", storedUserId);

    try {
      const response = await fetch(
        "https://driving.shellcode.cloud/license/driving/create",
        {
          method: "POST",
          body: formDataObj,
        }
      );

      if (response.ok) {
        const responseData = await response.json();
        console.log(responseData);
        if (responseData.success) {
          toast.success("Data added successfully!");
          navigate("/"); // Navigate to home after success
        }
      } else {
        toast.error("Submission failed. Please try again.");
      }
    } catch (error) {
      console.error("Error during form submission:", error);
      toast.error("An error occurred. Please try again.");
    }
  };

  const initializeRazorpay = async (amount, description) => {
    try {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      document.body.appendChild(script);

      script.onload = async () => {
        const tokenData = localStorage.getItem("token");
        const response = await fetch(
          "https://driving.shellcode.cloud/api/payments/create-order",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${tokenData}`,
            },
            body: JSON.stringify({
              amount,
              currency: "INR",
              receipt: "receipt#1",
            }),
            credentials: "include",
          }
        );

        const data = await response.json();
        if (!data.success) {
          toast.error("Failed to create order. Please try again.");
          return;
        }

        const options = {
          key: "rzp_test_3sEAtEoClhTs62",
          amount: data.order.amount,
          currency: "INR",
          name: "Driving License",
          description,
          order_id: data.order.id,
          prefill: {
            name: "",
            email: "",
            contact: "",
          },
          handler: async () => {
            toast.success("Payment successful! 🎉");
            setIsPayed(true);
          },
          theme: { color: "#3399cc" },
        };

        const razorpay = new window.Razorpay(options);
        razorpay.on("payment.failed", () =>
          toast.error("Payment failed. Please try again.")
        );
        razorpay.open();
      };
    } catch (error) {
      console.error("Error initializing Razorpay:", error);
      toast.error("An unexpected error occurred. Please try again.");
    }
  };

  return (
    <>
      <div className="flex h-screen flex-col items-center justify-center bg-gray-100 p-4">
        {step === 1 && (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-2 md:justify-center lg:grid-cols-2">
            {["2 Wheeler", "4 Wheeler", "T-Permit", "2 & 4 Wheeler"].map(
              (type) => (
                <button
                  key={type}
                  className="transform rounded-lg border border-gray-300 bg-white p-6 text-center shadow-lg transition duration-300 ease-in-out hover:scale-105 hover:bg-blue-100"
                  onClick={() => {
                    setVehicleType(type);
                    setStep(2);
                  }}
                >
                  {type}
                </button>
              )
            )}
          </div>
        )}

        {step === 2 && (
          <form
            className="mt-8 w-full max-w-lg space-y-6 rounded-lg bg-white p-6 shadow-lg"
            onSubmit={handleSubmit}
          >
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <FaIdCard size={24} className="text-gray-500" />
                <label
                  htmlFor="llPhoto"
                  className="flex-1 text-lg text-gray-700"
                >
                  Learning License Photo (LL)
                </label>
                <input
                  id="llPhoto"
                  type="file"
                  className="w-40 rounded-lg border border-gray-300 p-2 focus:ring-2 focus:ring-blue-500"
                  onChange={(e) => handleFileUpload(e, "llPhoto")}
                  accept=".jpg,.png,.pdf"
                  required
                />
              </div>
            </div>

            {/* Display the price */}
            <div className="mt-4 text-center text-lg font-semibold text-gray-800">
              <p>
                Total Price: <span className="text-blue-500">₹{price}</span>
              </p>
            </div>
            {isPayed ? (
              <button
                onClick={handleSubmit}
                className="w-full rounded-lg bg-green-500 py-3 text-white transition duration-300 ease-in-out hover:bg-green-600"
              >
                Submit
              </button>
            ) : (
              <button
                type="button"
                className="w-full rounded-lg bg-blue-500 py-3 text-white transition duration-300 ease-in-out hover:bg-blue-600"
                onClick={() => initializeRazorpay(price, "Learning License")}
              >
                Proceed to Payment
              </button>
            )}
          </form>
        )}
      </div>
    </>
  );
};

export default PageOne;
