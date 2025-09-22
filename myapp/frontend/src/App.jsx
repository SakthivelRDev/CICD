import { useState, useEffect } from "react";

// Get the API URL from the environment variable.
// If it's not set (in local dev), it defaults to the localhost URL.
const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

function App() {
  const [students, setStudents] = useState([]);
  const [name, setName] = useState("");

  // Function to fetch students
  const fetchStudents = () => {
    fetch(`${apiUrl}/students`) // Use the dynamic apiUrl
      .then((res) => res.json())
      .then((data) => setStudents(data))
      .catch((error) => console.error("Error fetching students:", error));
  };

  // Fetch students from backend on initial component load
  useEffect(() => {
    fetchStudents();
  }, []);

  // Add a new student
  const addStudent = async (e) => {
    e.preventDefault(); // Prevent form submission from reloading the page
    if (!name.trim()) return; // Don't add empty names

    await fetch(`${apiUrl}/students`, { // Use the dynamic apiUrl
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
    setName(""); // Clear the input box
    fetchStudents(); // Refresh the student list
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