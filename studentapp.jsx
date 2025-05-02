import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [name, setName] = useState('');
  const [regno, setRegno] = useState('');
  const [cgpa, setCgpa] = useState(0.0);
  const [dept, setDept] = useState('');
  const [students, setStudents] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [searchId, setSearchId] = useState('');
  const [searchResult, setSearchResult] = useState(null);

  const saveStudent = async (event) => {
    event.preventDefault();
    try {
      if (editingId) {
        await axios.put(`http://localhost:8000/updateStudent/${editingId}`, {
          name, regno, cgpa, dept
        });
        alert('Student updated successfully');
        setEditingId(null);
      } else {
        await axios.post('http://localhost:8000/saveStudent', {
          name, regno, cgpa, dept
        });
        alert('Student saved successfully');
      }

      // Clear form
      setName('');
      setRegno('');
      setCgpa(0.0);
      setDept('');

      fetchStudents();
    } catch (err) {
      alert('Error: ' + err.message);
    }
  };

  const fetchStudents = async () => {
    try {
      const response = await axios.get('http://localhost:8000/students');
      setStudents(response.data);
    } catch (err) {
      console.log(err);
    }
  };

  const deleteStudent = async (id) => {
    try {
      await axios.delete(`http://localhost:8000/deleteStudent/${id}`);
      alert('Student deleted successfully');
      fetchStudents();
    } catch (err) {
      alert('Error: ' + err.message);
    }
  };

  const editStudent = (student) => {
    setEditingId(student._id);
    setName(student.name);
    setRegno(student.regno);
    setCgpa(student.cgpa);
    setDept(student.dept);
  };

  const searchStudentById = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/student/${searchId}`);
      setSearchResult(response.data);
    } catch (error) {
      setSearchResult(null);
      alert('Student not found');
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  return (
    <div>
      <h1>{editingId ? 'Edit Student' : 'Save New Student'}</h1>

      <form onSubmit={saveStudent}>
        <div>
          <label>Name: </label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <br />
        <div>
          <label>Reg No: </label>
          <input type="text" value={regno} onChange={(e) => setRegno(e.target.value)} required />
        </div>
        <br />
        <div>
          <label>CGPA: </label>
          <input
            type="number"
            step="0.01"
            value={cgpa}
            onChange={(e) => setCgpa(e.target.value ? parseFloat(e.target.value) : 0)}
            required
          />
        </div>
        <br />
        <div>
          <label>Dept: </label>
          <input type="text" value={dept} onChange={(e) => setDept(e.target.value)} required />
        </div>
        <br />

        <button type="submit">{editingId ? 'Update Student' : 'Save Student'}</button>
      </form>

      <h2>Students List</h2>
      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>Name</th>
            <th>Reg No</th>
            <th>CGPA</th>
            <th>Dept</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student) => (
            <tr key={student._id}>
              <td>{student.name}</td>
              <td>{student.regno}</td>
              <td>{student.cgpa}</td>
              <td>{student.dept}</td>
              <td>
                <button onClick={() => editStudent(student)}>Edit</button>
                <button onClick={() => deleteStudent(student._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>Search Student by ID</h2>
      <input
        type="text"
        placeholder="Enter Student ID"
        value={searchId}
        onChange={(e) => setSearchId(e.target.value)}
      />
      <button onClick={searchStudentById}>Search</button>

      {searchResult && (
        <div style={{ marginTop: '20px' }}>
          <h3>Student Details</h3>
          <p><strong>Name:</strong> {searchResult.name}</p>
          <p><strong>Reg No:</strong> {searchResult.regno}</p>
          <p><strong>CGPA:</strong> {searchResult.cgpa}</p>
          <p><strong>Dept:</strong> {searchResult.dept}</p>
        </div>
      )}
    </div>
  );
}

export default App;
