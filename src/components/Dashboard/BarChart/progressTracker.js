// progressTracker.js

export const fetchUserProgress = async () => {
    const userId = localStorage.getItem('userId'); // Retrieve userId from local storage
    const token = localStorage.getItem('authToken');
    console.log('Fetching progress for user ID:', userId);
    
    console.log('Token:', token); // Check if the token is being retrieved


    if (!token) {
        throw new Error('No authorization token found. Please log in.');
    }

    const response = await fetch(`http://localhost:5000/api/students/progress/${userId}`, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    });

    if (response.status === 401) {
        throw new Error('Unauthorized: Invalid token. Please log in again.');
    }

    if (response.status === 403) {
        throw new Error('Forbidden: You do not have permission to access this resource.');
    }

    if (!response.ok) {
        throw new Error('Failed to fetch progress: ' + response.statusText);
    }

    const data = await response.json();
    console.log('Progress data:', data); 
    return data.quizScores;
};



