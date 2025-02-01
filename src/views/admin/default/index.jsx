import { useEffect, useState } from "react";
import { IoMdHome } from "react-icons/io";
import { IoDocuments } from "react-icons/io5";
import { MdBarChart, MdDashboard } from "react-icons/md";

import Widget from "components/widget/Widget";

const Dashboard = () => {
  const [data, setData] = useState({
    customerCount: 0,
    subadminCount: 0,
    averageDailyCount: 0,
    lastTenCustomers: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          customerCountRes,
          subadminCountRes,
          averageDailyCountRes,
          lastTenCustomersRes,
        ] = await Promise.all([
          fetch("https://driving.shellcode.cloud/api/admin/customers/count"),
          fetch("https://driving.shellcode.cloud/api/admin/subadmins/count"),
          fetch(
            "https://driving.shellcode.cloud/api/admin/average-daily-count"
          ),
          fetch("https://driving.shellcode.cloud/api/admin/last-ten-customers"),
        ]);

        const customerCountData = await customerCountRes.json();
        const subadminCountData = await subadminCountRes.json();
        const averageDailyCountData = await averageDailyCountRes.json();
        const lastTenCustomersData = await lastTenCustomersRes.json();

        setData({
          customerCount: customerCountData.totalCustomers,
          subadminCount: subadminCountData.totalSubadmins,
          averageDailyCount: parseFloat(
            averageDailyCountData.averageDailyCount
          ),
          lastTenCustomers: lastTenCustomersData.customers,
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      {/* Card widget */}
      <div className="mt-3 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-3 3xl:grid-cols-6">
        <Widget
          icon={<IoDocuments className="h-6 w-6" />}
          title={"Vendor Customers"}
          subtitle={data.customerCount}
        />
        <Widget
          icon={<MdDashboard className="h-6 w-6" />}
          title={"Vendor Subadmins"}
          subtitle={data.subadminCount}
        />
        <Widget
          icon={<MdBarChart className="h-7 w-7" />}
          title={"Average Daily Count"}
          subtitle={data.averageDailyCount.toFixed(2)}
        />
      </div>

      {/* Display last ten customers */}
      <div className="mt-5">
        <h2 className="text-xl font-semibold">Last Ten Customers</h2>
        <ul className="mt-3">
          {data.lastTenCustomers.map((customer, index) => (
            <li key={index} className="border-b py-2">
              <p>
                <strong>Email:</strong> {customer.email}
              </p>
              <p>
                <strong>Phone Number:</strong> {customer.phone_number}
              </p>
              <p>
                <strong>Created At:</strong>{" "}
                {new Date(customer.created_at).toLocaleString()}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;
