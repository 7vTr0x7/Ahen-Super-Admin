import { useEffect, useState } from "react";
import CourseContentForm from "./CourseContentForm";

export default function CoursePopup({ course, closePopup }) {
  const [courseContent, setCourseContent] = useState([]);
  const [isContentFormOpen, setIsContentFormOpen] = useState(false);
  const [editingContent, setEditingContent] = useState(null);

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      const res = await fetch(
        `https://driving.shellcode.cloud/coursecontent/course/${course.courseId}`
      );
      const data = await res.json();
      setCourseContent(data || []);
    } catch (error) {
      console.error("Error fetching course content:", error);
    }
  };

  return (
    <div
      className="bg-black fixed inset-0 flex items-center justify-center bg-opacity-50"
      onClick={closePopup}
    >
      <div
        className="mt-10 max-h-[80vh] w-full max-w-lg overflow-y-auto rounded bg-white p-6 shadow-lg"
        onClick={(e) => e.stopPropagation()} // Prevent click event from closing the popup
      >
        <div className="mb-4 flex justify-between">
          <h2 className="text-2xl font-semibold">{course.title}</h2>
          <button
            onClick={closePopup}
            className="rounded bg-gray-400 px-3 py-2 text-white"
          >
            X
          </button>
        </div>

        <button
          onClick={() => setIsContentFormOpen(true)}
          className="rounded bg-blue-600 px-5 py-2 text-white"
        >
          + Add Content
        </button>

        <div className="mt-6">
          {courseContent.length > 0 ? (
            courseContent.map((content) => (
              <div
                key={content.id}
                className="mt-2 rounded border p-4 shadow-sm"
              >
                <h3 className="text-lg font-semibold">
                  {content.title || "No Title"}
                </h3>
                <p>{content.learn_description}</p>
                <p>Day: {content.day}</p>
                <p className="text-sm text-gray-500">Price: ${content.price}</p>
                <img
                  src={content.session_image}
                  alt="Session"
                  className="mt-2 w-full rounded"
                />
                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() => setEditingContent(content)}
                    className="rounded bg-green-500 px-4 py-2 text-white"
                  >
                    Edit
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500">No content available.</p>
          )}
        </div>

        {isContentFormOpen && (
          <CourseContentForm
            courseId={course.courseId}
            closeForm={() => {
              setIsContentFormOpen(false);
              fetchContent();
            }}
          />
        )}

        {editingContent && (
          <CourseContentForm
            courseId={course.courseId}
            contentData={editingContent}
            closeForm={() => {
              setEditingContent(null);
              fetchContent();
            }}
          />
        )}
      </div>
    </div>
  );
}
