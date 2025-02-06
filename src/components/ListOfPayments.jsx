import React, { useEffect, useState } from "react";

const ListOfPayments = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const response = await fetch(
          "https://driving.shellcode.cloud/api/admin/payment-details"
        );
        const data = await response.json();
        if (data.success) {
          setPayments(data.data);
        } else {
          setError("Failed to fetch payment details");
        }
      } catch (err) {
        setError("Error fetching data");
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="p-4">
      <h2 className="mb-4 text-xl font-bold">Payment Details</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="min-w-[200px] whitespace-nowrap border p-4">
                User Email
              </th>
              <th className="min-w-[150px] whitespace-nowrap border p-4">
                Mobile
              </th>
              <th className="min-w-[200px] whitespace-nowrap border p-4">
                Transaction ID
              </th>
              <th className="min-w-[150px] whitespace-nowrap border p-4">
                Amount
              </th>
              <th className="min-w-[150px] whitespace-nowrap border p-4">
                Payment Type
              </th>
              <th className="min-w-[150px] whitespace-nowrap border p-4">
                Status
              </th>
              <th className="min-w-[150px] whitespace-nowrap border p-4">
                Slot Date
              </th>
              <th className="min-w-[150px] whitespace-nowrap border p-4">
                Slot Time
              </th>
              <th className="min-w-[150px] whitespace-nowrap border p-4">
                Tax and Fees
              </th>
              <th className="min-w-[150px] whitespace-nowrap border p-4">
                Total
              </th>
              <th className="min-w-[150px] whitespace-nowrap border p-4">
                Session Type
              </th>
            </tr>
          </thead>
          <tbody>
            {payments.map((payment, index) => (
              <tr key={index} className="border">
                <td className="whitespace-nowrap border p-4">
                  {payment.user.email}
                </td>
                <td className="whitespace-nowrap border p-4">
                  {payment.user.mobile}
                </td>
                <td className="whitespace-nowrap border p-4">
                  {payment.transaction.id}
                </td>
                <td className="whitespace-nowrap border p-4">
                  {payment.transaction.amount}
                </td>
                <td className="whitespace-nowrap border p-4">
                  {payment.transaction.paymentType || "N/A"}
                </td>
                <td className="whitespace-nowrap border p-4">
                  {payment.details?.status || "N/A"}
                </td>
                <td className="whitespace-nowrap border p-4">
                  {payment.details?.slotDate
                    ? formatDate(payment.details.slotDate)
                    : "N/A"}
                </td>
                <td className="whitespace-nowrap border p-4">
                  {payment.details?.slotTime || "N/A"}
                </td>
                <td className="whitespace-nowrap border p-4">
                  {payment.details?.taxAndFees || "N/A"}
                </td>
                <td className="whitespace-nowrap border p-4">
                  {payment.details?.total || "N/A"}
                </td>
                <td className="whitespace-nowrap border p-4">
                  {payment.details?.sessionType || "N/A"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ListOfPayments;
