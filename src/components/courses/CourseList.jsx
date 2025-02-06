import { useState } from "react";
import CoursePopup from "./CoursePopup";
import CourseForm from "./CourseForm";

export default function CourseList({ courses, fetchCourses }) {
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isEditFormOpen, setIsEditFormOpen] = useState(false);
  const [bgBlur, setBgBlur] = useState(false); // Manage background blur

  const handleDelete = async (courseId) => {
    try {
      await fetch(`https://driving.shellcode.cloud/api/courses/${courseId}`, {
        method: "DELETE",
      });
      fetchCourses();
    } catch (error) {
      console.error("Failed to delete course:", error);
    }
  };

  return (
    <div
      className={`mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 ${
        bgBlur ? "blur-sm" : ""
      }`}
    >
      {courses.map((course) => (
        <div key={course.courseId} className="rounded border p-4 shadow-md">
          {/* Course Image */}
          <img
            src={course.image}
            alt={course.title}
            className="h-40 w-full rounded object-cover"
          />

          {/* Course Details */}
          <h3 className="mt-2 text-lg font-semibold">{course.title}</h3>
          <p className="text-sm text-gray-600">{course.about}</p>

          {/* Course Stats */}
          <div className="mt-2 text-sm">
            <p>
              <strong>Price:</strong> ₹{course.price}
            </p>
            <p>
              <strong>Discount:</strong> {course.discount}%
            </p>
            <p>
              <strong>Star Rating:</strong> ⭐ {course.starRating}
            </p>
            <p>
              <strong>Total Sessions:</strong> {course.totalSession}
            </p>
            <p>
              <strong>Daily Amount:</strong> ₹{course.dailyAmount}
            </p>
          </div>

          {/* Buttons */}
          <div className="mt-3 flex justify-between">
            <button
              onClick={() => {
                setSelectedCourse(course);
                setIsPopupOpen(true);
              }}
              className="rounded bg-green-500 px-3 py-1 text-white"
            >
              View
            </button>

            <button
              onClick={() => {
                setSelectedCourse(course);
                setIsEditFormOpen(true);
              }}
              className="rounded bg-yellow-500 px-3 py-1 text-white"
            >
              Update
            </button>

            <button
              onClick={() => handleDelete(course.courseId)}
              className="rounded bg-red-500 px-3 py-1 text-white"
            >
              Delete
            </button>
          </div>
        </div>
      ))}

      {/* View Course Popup */}
      {isPopupOpen && selectedCourse && (
        <CoursePopup
          course={selectedCourse}
          closePopup={() => setIsPopupOpen(false)}
        />
      )}

      {/* Edit Course Popup */}
      {isEditFormOpen && selectedCourse && (
        <CourseForm
          closeForm={() => setIsEditFormOpen(false)}
          fetchCourses={fetchCourses}
          isEdit={true}
          courseData={selectedCourse}
          setBgBlur={setBgBlur} // Pass the blur state here
        />
      )}
    </div>
  );
}
