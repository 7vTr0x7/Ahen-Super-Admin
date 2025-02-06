import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";

const BASE_URL = "https://driving.shellcode.cloud/coursecontent";

export default function CourseContentForm({
  courseId,
  contentData,
  closeForm,
}) {
  const [formData, setFormData] = useState({
    course_id: courseId,
    title: "",
    day: "",
    learn_description: "",
    tips_description: "",
    price: "",
    session_image: null,
    learn_image: null,
    tips_image: null,
  });

  useEffect(() => {
    if (contentData) {
      setFormData({
        ...contentData,
        session_image: null,
        learn_image: null,
        tips_image: null,
      });
    }
  }, [contentData]);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "file" ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title || !formData.course_id) {
      toast.error("Title and Course ID are required.");
      return;
    }

    const form = new FormData();
    Object.keys(formData).forEach((key) => {
      if (formData[key] !== null) {
        form.append(key, formData[key]);
      }
    });

    try {
      const res = await fetch(
        contentData ? `${BASE_URL}/${contentData.id}` : BASE_URL,
        {
          method: contentData ? "PUT" : "POST",
          body: form,
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to update content");

      toast.success(
        contentData
          ? "Content updated successfully!"
          : "Content added successfully!"
      );
      closeForm();
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="bg-black absolute top-32 z-50 flex max-h-[80vh] w-full max-w-lg items-center justify-center overflow-y-auto bg-opacity-50 backdrop-blur-sm">
      <div
        className="w-full max-w-lg overflow-y-auto rounded bg-white p-6 shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="mb-4 text-xl font-semibold">
          {contentData ? "Edit Course Content" : "Add Course Content"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="title"
            placeholder="Session Title"
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full rounded border p-2"
          />
          <input
            type="text"
            name="day"
            placeholder="Day"
            value={formData.day}
            onChange={handleChange}
            className="w-full rounded border p-2"
          />
          <input
            type="text"
            name="learn_description"
            placeholder="Learn Description"
            value={formData.learn_description}
            onChange={handleChange}
            required
            className="w-full rounded border p-2"
          />
          <input
            type="text"
            name="tips_description"
            placeholder="Tips Description"
            value={formData.tips_description}
            onChange={handleChange}
            required
            className="w-full rounded border p-2"
          />
          <input
            type="number"
            name="price"
            placeholder="Price"
            value={formData.price}
            onChange={handleChange}
            required
            className="w-full rounded border p-2"
          />
          <input
            type="file"
            name="session_image"
            onChange={handleChange}
            className="w-full rounded border p-2"
          />
          <input
            type="file"
            name="learn_image"
            onChange={handleChange}
            className="w-full rounded border p-2"
          />
          <input
            type="file"
            name="tips_image"
            onChange={handleChange}
            className="w-full rounded border p-2"
          />
          <div className="flex justify-between">
            <button
              type="button"
              onClick={closeForm}
              className="rounded bg-gray-500 px-4 py-2 text-white hover:bg-gray-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
            >
              {contentData ? "Update Content" : "Add Content"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
