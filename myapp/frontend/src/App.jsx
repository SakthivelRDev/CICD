import { useState, useEffect } from "react";

// In production, this will be "/api". In development, it will be undefined.
const API_BASE_URL = import.meta.env.VITE_API_URL;

function App() {
  const [students, setStudents] = useState([]);
  const [name, setName] = useState("");

  // Helper function to build the full API URL
  const getApiUrl = (path) => {
    // If API_BASE_URL is set (in production), use it. Otherwise, use localhost.
    return API_BASE_URL ? `${API_BASE_URL}${path}` : `http://localhost:5000/api${path}`;
  };

  // Function to fetch students
  const fetchStudents = () => {
    fetch(getApiUrl("/students"))
      .then((res) => res.json())
      .then((data) => setStudents(data))
      .catch((error) => console.error("Error fetching students:", error));
  };

  // Fetch students on initial component load
  useEffect(() => {
    fetchStudents();
  }, []);

  // Add a new student
  const addStudent = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    await fetch(getApiUrl("/students"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
    setName("");
    fetchStudents();
  };

  return (
    <div style={{ padding: "20px", fontFamily: "sans-serif" }}>
      <h1>📚 Student List</h1>
      <form onSubmit={addStudent}>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter student name"
          style={{ padding: "8px", marginRight: "8px" }}
        />
        <button type="submit" style={{ padding: "8px" }}>
          Add Student
        </button>
      </form>
      <ul style={{ listStyleType: "none", paddingLeft: 0 }}>
        {students.map((s) => (
          <li key={s.id} style={{ padding: "5px 0" }}>
            {s.name}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;