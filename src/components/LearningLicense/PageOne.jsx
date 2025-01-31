import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom"; // Added for navigation

const PageOne = () => {
  const [step, setStep] = useState(1);
  const [vehicleType, setVehicleType] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [qualification, setQualification] = useState("");
  const [uploads, setUploads] = useState({
    aadhaarFront: null,
    aadhaarBack: null,
    signature: null,
  });
  const [price, setPrice] = useState(0);
  const [isPayed, setIsPayed] = useState(false);
  // const [user, setUser] = useState(null);

  const navigate = useNavigate();

  // useEffect(() => {
  //   const vendor = JSON.parse(localStorage.getItem("vendorData"));
  //   console.log(vendor);
  //   setUser(vendor);
  // }, []);

  useEffect(() => {
    const fetchPrice = async () => {
      try {
        const response = await fetch(
          "https://driving.shellcode.cloud/license/licenses/price"
        );
        const data = await response.json();
        if (response.ok && data?.data) {
          const learningPrice = data.data.find(
            (item) => item.price_type === "learning_license_customer_price"
          );
          if (learningPrice) {
            setPrice(parseFloat(learningPrice.price));
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

    const storedUserId = localStorage.getItem("vendorId");
    if (!storedUserId) {
      toast.error("User ID not found. Please log in again.");
      return;
    }

    if (
      !vehicleType ||
      !mobileNumber ||
      !uploads.aadhaarFront ||
      !uploads.aadhaarBack ||
      !uploads.signature
    ) {
      toast.error(
        "Please fill in all required fields and upload necessary files."
      );
      return;
    }

    const formDataObj = new FormData();
    formDataObj.append("license_type", "learning");
    formDataObj.append("vehicle_type", vehicleType);
    formDataObj.append("mobile_number", mobileNumber);
    formDataObj.append("qualification", qualification || "");
    formDataObj.append("vendor_id", storedUserId);

    formDataObj.append(
      "aadhar_front_photo",
      uploads.aadhaarFront,
      uploads.aadhaarFront.name
    );
    formDataObj.append(
      "aadhar_back_photo",
      uploads.aadhaarBack,
      uploads.aadhaarBack.name
    );
    formDataObj.append(
      "signature_photo",
      uploads.signature,
      uploads.signature.name
    );
    formDataObj.append("payment_filed", price.toString());
    formDataObj.append("user_id", storedUserId);

    console.log(formDataObj);

    try {
      const response = await fetch(
        "https://driving.shellcode.cloud/license/learning/create",
        {
          method: "POST",
          body: formDataObj,
        }
      );

      const responseData = await response.json();
      console.log(responseData);
      if (response.ok && responseData.success) {
        toast.success(responseData.message);
        navigate("/"); // Navigate to home after success
      } else {
        toast.error(
          responseData.message || "Submission failed. Please try again."
        );
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    }
  };

  const initializeRazorpay = async (amount, description) => {
    const tokenData = localStorage.getItem("token");
    console.log(tokenData);
    try {
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
      console.log(data);
      if (!data.success) {
        toast.error("Failed to create order. Please try again.");
        return;
      }

      const options = {
        key: "rzp_test_3sEAtEoClhTs62",
        amount: data.order.amount,
        currency: "INR",
        name: "Ahen",
        description,
        order_id: data.order.id,
        handler: async () => {
          toast.success("Payment successful!");
          setIsPayed(true); // Update the button after payment success
        },
        prefill: {
          name: "",
          email: "",
          contact: "",
        },
        theme: { color: "#3399cc" },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.on("payment.failed", () =>
        toast.error("Payment failed. Please try again.")
      );
      razorpay.open();
    } catch (error) {
      toast.error("Invalid token format. Please log in again.");
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
            <div>
              <label
                htmlFor="mobile"
                className="mb-2 block text-lg font-medium text-gray-700"
              >
                Mobile Number (Aadhaar linked)
                <span className="text-red-500">*</span>
              </label>
              <input
                id="mobile"
                type="text"
                className="w-full rounded-lg border border-gray-300 p-3 focus:ring-2 focus:ring-blue-500"
                placeholder="Enter mobile number"
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value)}
                required
              />
            </div>

            <div>
              <label
                htmlFor="qualification"
                className="mb-2 block text-lg font-medium text-gray-700"
              >
                Qualification
              </label>
              <select
                id="qualification"
                className="w-full rounded-lg border border-gray-300 p-3 focus:ring-2 focus:ring-blue-500"
                value={qualification}
                onChange={(e) => setQualification(e.target.value)}
              >
                <option value="">Select Qualification</option>
                {["10th", "12th", "Graduate", "Post Graduate"].map((qual) => (
                  <option key={qual} value={qual}>
                    {qual}
                  </option>
                ))}
              </select>
            </div>

            <div>
              {["aadhaarFront", "aadhaarBack", "signature"].map((key) => (
                <div key={key}>
                  <label className="mb-2 block text-lg font-medium text-gray-700">
                    {key
                      .replace(/([A-Z])/g, " $1")
                      .replace("aadhaar", "Aadhaar")}
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="file"
                    className="w-full rounded-lg border border-gray-300 p-3"
                    onChange={(e) => handleFileUpload(e, key)}
                    required
                  />
                </div>
              ))}
            </div>

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
