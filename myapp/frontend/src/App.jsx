import { useState, useEffect } from "react";

// In production, Vite sets this to "/api". In local development, it is undefined.
const API_BASE_URL = import.meta.env.VITE_API_URL;

function App() {
  const [students, setStudents] = useState([]);
  const [name, setName] = useState("");
  const [error, setError] = useState(null); // State to hold any errors

  // This helper function creates the correct full API path for any environment.
  const getApiUrl = (path) => {
    // If API_BASE_URL is defined (in production), use it. Otherwise, default to localhost.
    return API_BASE_URL ? `${API_BASE_URL}${path}` : `http://localhost:5000/api${path}`;
  };

  // Function to fetch all students from the backend
  const fetchStudents = async () => {
    try {
      setError(null); // Clear previous errors
      const response = await fetch(getApiUrl("/students"));
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      setStudents(data);
    } catch (e) {
      console.error("Error fetching students:", e);
      setError("Could not fetch the list of students."); // Set a user-friendly error message
    }
  };

  // Fetch students only when the component first loads
  useEffect(() => {
    fetchStudents();
  }, []);

  // Function to add a new student
  const addStudent = async (e) => {
    e.preventDefault(); // Prevents the page from reloading on form submission
    if (!name.trim()) return; // Do not allow adding empty names

    try {
      setError(null); // Clear previous errors
      const response = await fetch(getApiUrl("/students"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      setName(""); // Clear the input field
      fetchStudents(); // Re-fetch the list to show the new student
    } catch (e) {
      console.error("Error adding student:", e);
      setError("Could not add the new student.");
    }
  };

  return (
    <div style={{ padding: "20px", fontFamily: "sans-serif", maxWidth: "500px", margin: "auto" }}>
      <h1>📚 Student List</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={addStudent} style={{ display: "flex", marginBottom: "20px" }}>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter student name"
          style={{ flexGrow: 1, padding: "8px", marginRight: "8px", border: "1px solid #ccc", borderRadius: "4px" }}
        />
        <button type="submit" style={{ padding: "8px 16px", border: "none", backgroundColor: "#007bff", color: "white", borderRadius: "4px", cursor: "pointer" }}>
          Add Student
        </button>
      </form>
      <ul style={{ listStyleType: "none", paddingLeft: 0 }}>
        {students.map((s) => (
          <li key={s.id} style={{ padding: "8px 0", borderBottom: "1px solid #eee" }}>
            {s.name}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;