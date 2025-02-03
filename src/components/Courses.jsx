import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

const BASE_URL = "https://driving.shellcode.cloud/api/courses";

export default function Courses() {
  const [courses, setCourses] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    about: "",
    price: "",
    discount: "",
    starRating: "",
    totalSession: "",
    dailyAmount: "",
    photo: null,
  });
  const [editingCourseId, setEditingCourseId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState(null);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const res = await fetch(BASE_URL);
      const data = await res.json();
      if (data.data) {
        setCourses(data.data);
      }
    } catch (error) {
      toast.error("Failed to fetch courses.");
    }
  };

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "file" ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const updatedFormData = {
      ...formData,
      totalSession: formData.totalSession ? Number(formData.totalSession) : 0,
      dailyAmount: formData.dailyAmount ? Number(formData.dailyAmount) : 0,
    };

    const form = new FormData();
    Object.keys(updatedFormData).forEach((key) => {
      form.append(key, updatedFormData[key]);
    });

    const url = editingCourseId ? `${BASE_URL}/${editingCourseId}` : BASE_URL;
    const method = editingCourseId ? "PUT" : "POST";

    try {
      const res = await fetch(url, { method, body: form });
      if (!res.ok) throw new Error("Something went wrong!");

      toast.success(
        `Course ${editingCourseId ? "updated" : "created"} successfully!`
      );
      resetForm();
      fetchCourses();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!courseToDelete) return;
    try {
      await fetch(`${BASE_URL}/${courseToDelete}`, { method: "DELETE" });
      toast.success("Course deleted successfully!");
      fetchCourses();
      setIsPopupOpen(false);
    } catch (error) {
      toast.error("Failed to delete the course.");
    }
  };

  const handleEdit = (course) => {
    setFormData({
      ...course,
      totalSession: course.totalSession || 0,
      dailyAmount: course.dailyAmount || 0,
    });
    setEditingCourseId(course.courseId);
    setIsFormOpen(true);
  };

  const openForm = () => {
    resetForm();
    setIsFormOpen(true);
  };

  const openPopup = (courseId) => {
    setCourseToDelete(courseId);
    setIsPopupOpen(true);
  };

  const resetForm = () => {
    setFormData({
      title: "",
      about: "",
      price: "",
      discount: "",
      starRating: "",
      totalSession: "",
      dailyAmount: "",
      photo: null,
    });
    setEditingCourseId(null);
    setIsFormOpen(false);
  };

  return (
    <div className="mx-auto mt-10 max-w-4xl p-6">
      <h1 className="text-center text-2xl font-bold">Manage Courses</h1>

      <button
        onClick={openForm}
        className="mt-4 w-full rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
      >
        + Add New Course
      </button>

      {isFormOpen && (
        <div className="bg-black fixed inset-0 z-50 flex items-center justify-center bg-opacity-50">
          <div className="w-full max-w-lg rounded-lg bg-white p-6 shadow-lg">
            <h2 className="text-lg font-semibold">
              {editingCourseId ? "Edit Course" : "Create Course"}
            </h2>
            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              <input
                type="text"
                name="title"
                placeholder="Course Title (e.g., Advanced Driving Techniques)"
                value={formData.title}
                onChange={handleChange}
                className="w-full rounded border p-2"
                required
              />
              <input
                type="text"
                name="about"
                placeholder="Short Course Description"
                value={formData.about}
                onChange={handleChange}
                className="w-full rounded border p-2"
                required
              />
              <input
                type="number"
                name="price"
                placeholder="Price (e.g., 199.99)"
                value={formData.price}
                onChange={handleChange}
                className="w-full rounded border p-2"
                required
              />
              <input
                type="number"
                name="discount"
                placeholder="Discount (%) (e.g., 10)"
                value={formData.discount}
                onChange={handleChange}
                className="w-full rounded border p-2"
                required
              />
              <input
                type="number"
                step="0.1"
                name="starRating"
                placeholder="Star Rating (1.0 - 5.0)"
                value={formData.starRating}
                onChange={handleChange}
                className="w-full rounded border p-2"
                required
              />
              <input
                type="number"
                name="totalSession"
                placeholder="Total Sessions (e.g., 12)"
                value={formData.totalSession}
                onChange={handleChange}
                className="w-full rounded border p-2"
                required
              />
              <input
                type="number"
                name="dailyAmount"
                placeholder="Daily Amount (e.g., 2)"
                value={formData.dailyAmount}
                onChange={handleChange}
                className="w-full rounded border p-2"
                required
              />
              <input
                type="file"
                name="photo"
                onChange={handleChange}
                className="w-full rounded border p-2"
              />

              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={resetForm}
                  className="rounded bg-gray-500 px-4 py-2 text-white hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
                >
                  {loading
                    ? "Processing..."
                    : editingCourseId
                    ? "Update"
                    : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="mt-6">
        <h2 className="text-xl font-semibold">All Courses</h2>
        {courses.length === 0 ? (
          <p className="text-gray-500">No courses available.</p>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {courses.map((course) => (
              <div
                key={course.courseId}
                className="rounded-lg border p-4 shadow-md"
              >
                <h3 className="font-semibold">{course.title}</h3>
                <p className="text-sm text-gray-600">{course.about}</p>
                <div className="mt-2 flex justify-between">
                  <button
                    onClick={() => handleEdit(course)}
                    className="rounded bg-yellow-500 px-3 py-1 text-white hover:bg-yellow-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => openPopup(course.courseId)}
                    className="rounded bg-red-500 px-3 py-1 text-white hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {isPopupOpen && (
        <div className="bg-black fixed inset-0 z-50 flex items-center justify-center bg-opacity-50">
          <div className="w-full max-w-md rounded-lg bg-white p-6 text-center shadow-lg">
            <h3 className="font-semibold">
              Are you sure you want to delete this course?
            </h3>
            <div className="mt-4">
              <button
                onClick={handleDelete}
                className="mr-4 rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600"
              >
                Yes
              </button>
              <button
                onClick={() => setIsPopupOpen(false)}
                className="rounded bg-gray-500 px-4 py-2 text-white hover:bg-gray-600"
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
