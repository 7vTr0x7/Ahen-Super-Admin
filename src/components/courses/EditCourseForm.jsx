import { useState } from "react";
import { toast } from "react-hot-toast";

export default function EditCourseForm({ course, closeForm, refreshCourses }) {
  const [formData, setFormData] = useState({
    title: course.title,
    about: course.about,
    price: course.price,
    discount: course.discount,
    starRating: course.starRating,
    totalSession: course.totalSession,
    dailyAmount: course.dailyAmount,
    photo: null,
  });

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "file" ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData();
    Object.keys(formData).forEach((key) => {
      if (formData[key] !== null) {
        form.append(key, formData[key]);
      }
    });

    try {
      await fetch(`https://driving.shellcode.cloud/api/courses/${course.courseId}`, {
        method: "PUT",
        body: form,
      });

      toast.success("Course updated successfully!");
      refreshCourses();
      closeForm();
    } catch {
      toast.error("Failed to update course.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="w-full max-w-lg bg-white p-6 rounded shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Edit Course</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" name="title" value={formData.title} onChange={handleChange} className="w-full border p-2" required />
          <input type="text" name="about" value={formData.about} onChange={handleChange} className="w-full border p-2" required />
          <input type="number" name="price" value={formData.price} onChange={handleChange} className="w-full border p-2" required />
          <input type="file" name="photo" onChange={handleChange} className="w-full border p-2" />
          <div className="flex justify-between">
            <button onClick={closeForm} className="bg-gray-500 text-white px-4 py-2 rounded">Cancel</button>
            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Update</button>
          </div>
        </form>
      </div>
    </div>
  );
}
