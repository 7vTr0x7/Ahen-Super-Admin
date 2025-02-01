import { useEffect, useState } from "react";

const PurchasedCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch(
          "https://driving.shellcode.cloud/api/admin/get-all-purchased-courses"
        );
        const data = await response.json();
        setCourses(data.bookings);
      } catch (error) {
        setError("Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  if (loading) return <p className="text-center text-gray-500">Loading...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Purchased Courses</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 shadow-md rounded-lg">
          <thead>
            <tr className="bg-gray-100 border-b">
              <th className="p-3 text-left">ID</th>
              <th className="p-3 text-left">User ID</th>
              <th className="p-3 text-left">Course ID</th>
              <th className="p-3 text-left">Purchase ID</th>
              <th className="p-3 text-left">Purchase Date</th>
              <th className="p-3 text-left">Amount</th>
              <th className="p-3 text-left">Session Type</th>
              <th className="p-3 text-left">Payment Type</th>
            </tr>
          </thead>
          <tbody>
            {courses.map((course) => (
              <tr key={course.id} className="border-b hover:bg-gray-50">
                <td className="p-3">{course.id}</td>
                <td className="p-3">{course.user_id}</td>
                <td className="p-3">{course.course_id}</td>
                <td className="p-3 break-all">{course.purchase_id}</td>
                <td className="p-3">{new Date(course.purchase_date).toLocaleString()}</td>
                <td className="p-3">${course.amount}</td>
                <td className="p-3">{course.sessiontype || "N/A"}</td>
                <td className="p-3">{course.paymenttype || "N/A"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PurchasedCourses;