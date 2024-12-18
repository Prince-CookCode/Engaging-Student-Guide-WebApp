import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './TakeQuiz.css';

const TakeQuiz = () => {
  const { id: resourceId } = useParams(); // Extract the resourceId from URL params
  const [questions, setQuestions] = useState([]);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [quizTitle, setQuizTitle] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [score, setScore] = useState(null); // Store the quiz score

  useEffect(() => {
    const fetchQuizData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:5000/api/quizzes/${resourceId}`);
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
        }
        const data = await response.json();
        if (data.quiz) {
          setQuestions(Array.isArray(data.quiz) ? data.quiz : []);
          setQuizTitle(data.name || 'Quiz');
        } else {
          throw new Error('No quiz data found in the response');
        }
      } catch (error) {
        console.error('Error fetching quiz data:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchQuizData();
  }, [resourceId]);

  const handleAnswerSelect = (questionIndex, answer) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [questionIndex]: answer
    });
  };

  const calculateScore = () => {
    let correctCount = 0;
    questions.forEach((q, index) => {
      if (selectedAnswers[index] === q.correctAnswer) {
        correctCount += 1;
      }
    });
    return (correctCount / questions.length) * 100; // Calculate as a percentage
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const calculatedScore = calculateScore();
    setScore(calculatedScore);

    alert(`Quiz submitted! Your score is: ${calculatedScore}%`);

    try {
        const token = localStorage.getItem('authToken'); // Get the token from localStorage
        // Send the score to the server for updating the student's document
        const response = await fetch('http://localhost:5000/api/students/updateScore', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`  // Ensure token is included
            },
            body: JSON.stringify({
                resourceId,
                score: calculatedScore,
            }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Failed to update the score in the database. ${errorText}`);
        }
        console.log('Score successfully updated in the database.');
    } catch (error) {
        console.error('Error updating score:', error);
        alert('Error updating score. Please try again later.');
    }
};



  if (loading) return <div>Loading quiz...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="quiz-container">
      <h1>{quizTitle}</h1>
      <p>This quiz is related to the resource you viewed.</p>

      <form onSubmit={handleSubmit}>
        {questions.length > 0 ? (
          questions.map((q, index) => (
            <div key={index} className="quiz-question">
              <p>{q.questionText}</p>
              {q.options.map((option, idx) => (
                <label key={idx}>
                  <input
                    type="radio"
                    name={`question-${index}`}
                    value={option}
                    onChange={() => handleAnswerSelect(index, option)}
                    checked={selectedAnswers[index] === option}
                  />
                  {' '}
                  {option}
                </label>
              ))}
            </div>
          ))
        ) : (
          <div>No questions available for this quiz.</div>
        )}
        <button type="submit" className="submit-quiz">Submit Quiz</button>
      </form>
      
      {score !== null && (
        <div className="quiz-score">
          <h2>Your Score: {score}%</h2>
        </div>
      )}
    </div>
  );
};

export default TakeQuiz;
