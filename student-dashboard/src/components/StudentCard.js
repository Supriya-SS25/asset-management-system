import React, { useState } from 'react';
import './StudentCard.css';

const StudentCard = ({ 
  student, 
  onButtonClick, 
  buttonText = "View Details",
  cardStyle = "default"
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleCardClick = () => {
    console.log(`Card clicked for student: ${student.name}`);
  };

  const handleButtonClick = (e) => {
    e.stopPropagation(); // Prevent card click when button is clicked
    if (onButtonClick) {
      onButtonClick(student);
    } else {
      alert(`Viewing details for ${student.name}\nGrade: ${student.grade}\nEmail: ${student.email}`);
    }
  };

  return (
    <div 
      className={`student-card ${cardStyle} ${isHovered ? 'hovered' : ''}`}
      onClick={handleCardClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="student-avatar">
        <img src={student.avatar || `https://picsum.photos/seed/${student.id}/100/100.jpg`} 
             alt={`${student.name}'s avatar`} />
      </div>
      
      <div className="student-info">
        <h3 className="student-name">{student.name}</h3>
        <p className="student-grade">Grade: {student.grade}</p>
        <p className="student-email">{student.email}</p>
        <p className="student-gpa">GPA: {student.gpa}</p>
      </div>
      
      <div className="student-actions">
        <button 
          className="student-button"
          onClick={handleButtonClick}
        >
          {buttonText}
        </button>
      </div>
      
      {isHovered && (
        <div className="student-badge">
          {student.status || 'Active'}
        </div>
      )}
    </div>
  );
};

export default StudentCard;
