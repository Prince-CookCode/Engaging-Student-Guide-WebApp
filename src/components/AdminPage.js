import React, { useState } from 'react';
import axios from 'axios';
import './AdminPage.css';

const AdminPage = () => {
    const [selectedOption, setSelectedOption] = useState('');
    const [category, setCategory] = useState('');
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [authorName, setAuthorName] = useState('');
    const [files, setFiles] = useState({
        pdf: null,
        audio: null,
        video: null
    });
    const [deleteName, setDeleteName] = useState('');
    const [message, setMessage] = useState('');

    const handleFileChange = (e) => {
        const { id, files } = e.target;
        const fieldName = id.replace('File', '').toLowerCase(); // 'pdfFile' -> 'pdf'
        if (files.length > 0) {
            setFiles(prevFiles => ({ ...prevFiles, [fieldName]: files[0] }));
        }
    };
    const handleUploadSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('category', category);
        formData.append('name', name);
        formData.append('description', description);
        formData.append('authorName', authorName);

        // Append files only if they are present
        if (files.pdf) formData.append('pdf', files.pdf);
        if (files.audio) formData.append('audio', files.audio);
        if (files.video) formData.append('video', files.video);

        console.log('FormData:', formData); // Check FormData

        try {
            const token = localStorage.getItem('authToken'); // Get the token from localStorage

            const response = await axios.post('http://localhost:5000/upload-resource', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}` // Include token in request headers
                },
            });
            setMessage(response.data.message);
        } catch (error) {
            console.error('Error uploading resource:', error);
            setMessage('Failed to upload resource.');
        }
    };

    const handleDeleteSubmit = async (e) => {
        e.preventDefault();

        try {
            const token = localStorage.getItem('authToken'); // Get the token from localStorage
            const response = await axios.delete(`http://localhost:5000/delete-resource/${deleteName}`, {
                headers: {
                    'Authorization': `Bearer ${token}` // Include token in request headers
                }
            });
            setMessage(response.data.message);
        } catch (error) {
            console.error('Error deleting resource:', error);
            setMessage('Failed to delete resource.');
        }
    };

    return (
        <div className="admin-container">
            <h2>Admin Page</h2>
            <div className="options">
                <button onClick={() => setSelectedOption('upload')}>Upload New Resource</button>
                <button onClick={() => setSelectedOption('delete')}>Delete Existing Resource</button>
            </div>

            {selectedOption === 'upload' && (
                <form onSubmit={handleUploadSubmit}>
                    <div className="form-group">
                        <label>Category:</label>
                        <div>
                            <label>
                                <input
                                    type="radio"
                                    value="Exams"
                                    checked={category === 'Exams'}
                                    onChange={(e) => setCategory(e.target.value)}
                                />
                                Exams
                            </label>
                            <label>
                                <input
                                    type="radio"
                                    value="Mental-Wellness"
                                    checked={category === 'Mental-Wellness'}
                                    onChange={(e) => setCategory(e.target.value)}
                                />
                                Mental-Wellness
                            </label>
                            <label>
                                <input
                                    type="radio"
                                    value="Physical-Wellness"
                                    checked={category === 'Physical-Wellness'}
                                    onChange={(e) => setCategory(e.target.value)}
                                />
                                Physical-Wellness
                            </label>
                            <label>
                                <input
                                    type="radio"
                                    value="Time Management"
                                    checked={category === 'Time Management'}
                                    onChange={(e) => setCategory(e.target.value)}
                                />
                                Time Management
                            </label>
                            <label>
                                <input
                                    type="radio"
                                    value="Others"
                                    checked={category === 'Others'}
                                    onChange={(e) => setCategory(e.target.value)}
                                />
                                Others
                            </label>
                        </div>
                    </div>
                    <div className="form-group">
                        <label htmlFor="name">Name:</label>
                        <input
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="description">Description:</label>
                        <textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            required
                        ></textarea>
                    </div>
                    <div className="form-group">
                        <label htmlFor="authorName">Author Name:</label>
                        <input
                            type="text"
                            id="authorName"
                            value={authorName}
                            onChange={(e) => setAuthorName(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="pdfFile">Add PDF:</label>
                        <input
                            type="file"
                            id="pdfFile"
                            onChange={handleFileChange}
                            accept=".pdf"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="audioFile">Add Audio:</label>
                        <input
                            type="file"
                            id="audioFile"
                            onChange={handleFileChange}
                            accept=".mp3,.wav"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="videoFile">Add Video:</label>
                        <input
                            type="file"
                            id="videoFile"
                            onChange={handleFileChange}
                            accept=".mp4,.avi,.mov"
                        />
                    </div>
                    <button type="submit" className="upload-button">Upload Resource</button>
                </form>
            )}

            {selectedOption === 'delete' && (
                <form onSubmit={handleDeleteSubmit}>
                    <div className="form-group">
                        <label htmlFor="deleteName">Resource Name:</label>
                        <input
                            type="text"
                            id="deleteName"
                            value={deleteName}
                            onChange={(e) => setDeleteName(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="upload-button">Delete Resource</button>
                </form>
            )}

            {message && <p className="message">{message}</p>}
        </div>
    );
};

export default AdminPage;
