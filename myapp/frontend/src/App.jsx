import { useState, useEffect } from "react";

function App() {
  const [students, setStudents] = useState([]);
  const [name, setName] = useState("");

  // Fetch students from backend
  useEffect(() => {
    fetch("http://localhost:5000/api/students")
      .then(res => res.json())
      .then(data => setStudents(data));
  }, []);

  // Add student
  const addStudent = async () => {
    await fetch("http://localhost:5000/api/students", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name })
    });
    setName("");
    // Refresh list
    fetch("http://localhost:5000/api/students")
      .then(res => res.json())
      .then(data => setStudents(data));
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>📚 Student List</h1>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Enter student name"
      />
      <button onClick={addStudent}>Add</button>
      <ul>
        {students.map(s => (
          <li key={s.id}>{s.name}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
