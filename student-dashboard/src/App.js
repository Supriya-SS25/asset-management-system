import React, { useState } from 'react';
import Navbar from './components/Navbar';
import StudentCard from './components/StudentCard';
import './App.css';

const App = () => {
  // Sample student data
  const [students] = useState([
    {
      id: 1,
      name: "Alice Johnson",
      grade: "10th Grade",
      email: "alice.johnson@school.edu",
      gpa: "3.8",
      status: "Active"
    },
    {
      id: 2,
      name: "Bob Smith",
      grade: "11th Grade", 
      email: "bob.smith@school.edu",
      gpa: "3.5",
      status: "Active"
    },
    {
      id: 3,
      name: "Carol Williams",
      grade: "9th Grade",
      email: "carol.williams@school.edu",
      gpa: "4.0",
      status: "Honor Roll"
    }
  ]);

  // Handle button click for student cards
  const handleStudentAction = (student) => {
    console.log('Student clicked:', student);
    alert(`Student Details:\n\nName: ${student.name}\nGrade: ${student.grade}\nEmail: ${student.email}\nGPA: ${student.gpa}\nStatus: ${student.status}`);
  };

  // Handle custom button actions
  const handleEditStudent = (student) => {
    alert(`Editing student: ${student.name}`);
  };

  const handleDeleteStudent = (student) => {
    if (window.confirm(`Are you sure you want to delete ${student.name}?`)) {
      alert(`Deleted: ${student.name}`);
    }
  };

  return (
    <div className="app">
      <Navbar title="Student Dashboard" />
      
      <main className="main-content">
        <div className="container">
          <div className="dashboard-header">
            <h2>Student Overview</h2>
            <p>Total Students: {students.length}</p>
          </div>

          <div className="students-grid">
            {/* Default style card */}
            <StudentCard 
              student={students[0]}
              onButtonClick={handleStudentAction}
              buttonText="View Details"
              cardStyle="default"
            />

            {/* Premium style card */}
            <StudentCard 
              student={students[1]}
              onButtonClick={handleEditStudent}
              buttonText="Edit Student"
              cardStyle="premium"
            />

            {/* Minimal style card */}
            <StudentCard 
              student={students[2]}
              onButtonClick={handleDeleteStudent}
              buttonText="Delete Student"
              cardStyle="minimal"
            />
          </div>

          <div className="component-demo">
            <h3>Component Reusability Demo</h3>
            <p>All three cards above use the same StudentCard component with different props!</p>
            <ul>
              <li><strong>Card 1:</strong> Default style with "View Details" button</li>
              <li><strong>Card 2:</strong> Premium style with "Edit Student" button</li>
              <li><strong>Card 3:</strong> Minimal style with "Delete Student" button</li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
