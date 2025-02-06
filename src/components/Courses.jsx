import { useState, useEffect } from "react";
import CourseList from "./courses/CourseList";
import CourseForm from "./courses/CourseForm";

export default function Courses() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const res = await fetch("https://driving.shellcode.cloud/api/courses");
      const data = await res.json();
      setCourses(data.data || []);
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold">Driving Courses</h1>
      <button
        onClick={() => setIsFormOpen(true)}
        className="mt-4 rounded bg-blue-500 px-4 py-2 text-white"
      >
        + Add New Course
      </button>

      {isFormOpen && (
        <CourseForm
          closeForm={() => setIsFormOpen(false)}
          fetchCourses={fetchCourses}
        />
      )}

      <CourseList courses={courses} fetchCourses={fetchCourses} />
    </div>
  );
}
