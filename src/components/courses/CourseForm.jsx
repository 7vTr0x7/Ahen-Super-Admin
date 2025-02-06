import { useState } from "react";
import { toast } from "react-hot-toast";

const BASE_URL = "https://driving.shellcode.cloud/api/courses";

export default function CourseForm({
  closeForm,
  fetchCourses,
  isEdit,
  courseData,
}) {
  const [formData, setFormData] = useState({
    title: isEdit ? courseData.title : "",
    about: isEdit ? courseData.about : "",
    price: isEdit ? courseData.price : "",
    discount: isEdit ? courseData.discount : "",
    starRating: isEdit ? courseData.starRating : "",
    totalSession: isEdit ? courseData.totalSession : "",
    dailyAmount: isEdit ? courseData.dailyAmount : "",
    photo: null,
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "file" ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.title || !formData.about || !formData.price) {
      toast.error("Title, About, and Price are required!");
      return;
    }

    setLoading(true);

    const formDataToSend = new FormData();
    Object.keys(formData).forEach((key) => {
      formDataToSend.append(key, formData[key]);
    });

    const method = isEdit ? "PUT" : "POST";
    const url = isEdit ? `${BASE_URL}/${courseData.courseId}` : BASE_URL;

    try {
      const res = await fetch(url, {
        method,
        body: formDataToSend,
      });

      if (res.ok) {
        toast.success(`Course ${isEdit ? "updated" : "created"} successfully!`);
        fetchCourses();
        closeForm();
      } else {
        const errorData = await res.json();
        toast.error(errorData.message || "Failed to save course.");
      }
    } catch (error) {
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-black absolute  top-52  flex items-center justify-center bg-opacity-50">
      <div className="w-96 rounded bg-white p-6 shadow-lg">
        <h2 className="mb-4 text-2xl font-bold">
          {isEdit ? "Edit Course" : "Add New Course"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Course Title"
            className="w-full rounded border p-2"
            required
          />
          <textarea
            name="about"
            value={formData.about}
            onChange={handleChange}
            placeholder="About the Course"
            className="w-full rounded border p-2"
            required
          />
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            placeholder="Price"
            className="w-full rounded border p-2"
            required
          />
          <input
            type="number"
            name="discount"
            value={formData.discount}
            onChange={handleChange}
            placeholder="Discount (%)"
            className="w-full rounded border p-2"
          />
          <input
            type="number"
            name="starRating"
            value={formData.starRating}
            onChange={handleChange}
            placeholder="Star Rating (1-5)"
            className="w-full rounded border p-2"
          />
          <input
            type="number"
            name="totalSession"
            value={formData.totalSession}
            onChange={handleChange}
            placeholder="Total Sessions"
            className="w-full rounded border p-2"
          />
          <input
            type="number"
            name="dailyAmount"
            value={formData.dailyAmount}
            onChange={handleChange}
            placeholder="Daily Amount"
            className="w-full rounded border p-2"
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
              onClick={closeForm}
              className="rounded bg-gray-400 px-4 py-2 text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`rounded px-4 py-2 text-white ${
                loading ? "bg-gray-500" : "bg-blue-500"
              }`}
              disabled={loading}
            >
              {loading ? "Saving..." : isEdit ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
