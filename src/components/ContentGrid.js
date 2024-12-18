import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import for navigation
import './ContentGrid.css';

const ContentGrid = () => {
    const [showModal, setShowModal] = useState(false);
    const [summary, setSummary] = useState('');
    const navigate = useNavigate(); // Initialize navigation hook

    const handleSummarize = async (resourceContent) => {
        console.log('Summarize button clicked'); // Debugging line
        setShowModal(true);
        try {
            // Replace with your API endpoint to get the summary
            const response = await fetch('/api/summarize', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ text: resourceContent })
            });
            const data = await response.json();
            setSummary(data.summary);
            setShowModal(true);
        } catch (error) {
            console.error('Error fetching summary:', error);
        }
    };
//some array with object_id of the resources [dxgsadhbdj,dsghajh,dsfhjdsah]
// for object_id in array {h3 = object_id.name; p= object_id.description; img src = object_id.fetch.image(google-cloud)}
    const handleCardClick = (resourceId) => {
        navigate(`/pdf-view/${resourceId}`); // Navigate to the PDF view page with the resource ID
    };

    return (
        <section className="content-grid">
            <h2>Resources</h2>
            <div className="grid">
                <div className="card" onClick={() => handleCardClick('66e725c98c3712933eaef2ba')}> {/* Example with resource ID 1 */}
                    <img src="/images/Exams.png" alt="Exams" className="card-img" />
                    <div className="card-content">
                        <h3>Acing exam season</h3>
                        <p>Surviving the first semester at UCT has been an incredible journey thus far, but the challenge isn't over yet.</p>
                    </div>
                </div>
                <div className="card" onClick={() => handleCardClick('66e7186f5fe243f4e7e06169')}> {/* Example with resource ID 2 */}
                    <img src="/images/brain.png" alt="Brain" className="card-img" />
                    <div className="card-content">
                        <h3>Challenge your brain</h3>
                        <p>Your ability to study successfully depends on your health and well-being.</p>
                    </div>
                </div>
                <div className="card" onClick={() => handleCardClick('66e7043042f6b3fe06f5f520')}> {/* Example with resource ID 2 */}
                    <img src="/images/cult.png" alt="Brain" className="card-img" />
                    <div className="card-content">
                        <h3>Culture Shock</h3>
                        <p>Many students experience culture shock in the UCT environment. What is culture, and why can UCT's culture cause an identity crisis or the feeling that you're an imposter?</p>
                    </div>
                </div>
                <div className="card" onClick={() => handleCardClick('66e71b53e6e5b8129f108d66')}> {/* Example with resource ID 2 */}
                    <img src="/images/Time.png" alt="Brain" className="card-img" />
                    <div className="card-content">
                        <h3>Time Management</h3>
                        <p>UCT is a tough environment. Don't fall into the trap of thinking that you already have this time management thing down.</p>
                    </div>
                </div>
                <div className="card" onClick={() => handleCardClick('66e71fe9e779c53f953d4542')}> {/* Example with resource ID 2 */}
                    <img src="/images/well.png" alt="Brain" className="card-img" />
                    <div className="card-content">
                        <h3>The shape of your well-being</h3>
                        <p>Your ability to study successfully depends on your health and well-being.</p>
                    </div>
                </div>
                <div className="card" onClick={() => handleCardClick('66e722529767457287c121e1')}> {/* Example with resource ID 2 */}
                    <img src="/images/metapng.png" alt="Brain" className="card-img" />
                    <div className="card-content">
                        <h3>Metacognition: Your key to success</h3>
                        <p>Now is a good time to do some metacognition, i.e. to pause and think about what you did in the first quarter and what you want to do in the second quarter.</p>
                    </div>
                </div>
                <div className="card" onClick={() => handleCardClick('66e72358bd2116c1d3750231')}> {/* Example with resource ID 2 */}
                    <img src="/images/vac.png" alt="Brain" className="card-img" />
                    <div className="card-content">
                        <h3>Make the most of your vac</h3>
                        <p>With exams drawing to a close, what are your hopes and fears for the vac? This chapter contains essential information about what you must do during the vac.</p>
                    </div>
                </div>
                <div className="card" onClick={() => handleCardClick('66e724f154ca9d0b3ac54173')}> {/* Example with resource ID 2 */}
                    <img src="/images/test.png" alt="Brain" className="card-img" />
                    <div className="card-content">
                        <h3>How to succeed in your first BSc tests</h3>
                        <p>Welcome to the exciting realm of university tests, where things are different from what you're used to in school.</p>
                    </div>
                </div>
                {/* Add more cards as needed */}
            </div>

            <div className="pagination">
                <a>« Prev</a>
                <a>1</a>
                <a>2</a >
                <a>3</a>
                <a>Next »</a>
            </div>

            {/* Modal for displaying the summary */}
            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3>Document Summary</h3>
                        <p>{summary}</p>
                        <button onClick={() => setShowModal(false)}>Close</button>
                    </div>
                </div>
            )};
            
            <footer className="footer">
                <div className="footer-content">
                    <p>© 2024 Your Website. All Rights Reserved.</p>
                    <div className="footer-links">
                        <a href="#about">About Us</a>
                        <a href="#contact">Contact</a>
                        <a href="#privacy">Privacy Policy</a>
                    </div>
                </div>
            </footer>

            
        </section>

        
    );
};

export default ContentGrid;
