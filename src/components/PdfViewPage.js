import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import ReactQuill from 'react-quill'; // Importing ReactQuill for rich-text editor
import 'react-quill/dist/quill.snow.css'; // Quill styles
import { jsPDF } from 'jspdf'; // Import jsPDF for generating PDF files
import { htmlToText } from 'html-to-text'; // Import html-to-text for converting HTML to plain text
import './PdfViewPage.css';


const PdfViewPage = () => {
  const { id } = useParams(); // Extract the resourceId from the URL parameters
  //const dataURL = '';
  const [Name, setName] = useState(null);
  const [pdfFile, setPdfFile] = useState(null);
  const [videoFile, setVideoFile] = useState(null);
  const [audioFile, setAudioFile] = useState(null);
  const [Brief, setBrief] = useState(null);
  const [summaryText, setSummaryText] = useState('');
  const [releaseInfo, setReleaseInfo] = useState('');
  const [showModal, setShowModal] = useState(null); // To manage which modal to show
  
  const [showNotes, setShowNotes] = useState(false); // Toggle notes section
  const [notes, setNotes] = useState(''); // Store user's notes

  const [readResources, setReadResources] = useState([]);

  // Custom toolbar configuration with color options
  const toolbarOptions = [
    [{ 'font': [] }],
    [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
    ['bold', 'italic', 'underline', 'strike'],        // Formatting buttons
    [{ 'color': [] }, { 'background': [] }],          // Add color and background color options
    [{ 'align': [] }],
    ['blockquote', 'code-block'],
    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
    ['link', 'image'],
    ['clean']                                         // Remove formatting button
  ];

  

  //###################################################################################################
  // Load the "read" resources from localStorage when the component mounts
  // useEffect(() => {
  //   if (localStorage.getItem('readResources') === null) {
  //     localStorage.setItem('readResources', JSON.stringify([]));
  //     const savedReadResourcesString = localStorage.getItem('readResources');
  //     const savedReadResources = savedReadResourcesString ? JSON.parse(savedReadResourcesString) : [];
  //     setReadResources(savedReadResources);
      
  //   }  
  //   const savedReadResourcesString = localStorage.getItem('readResources');
  //   const savedReadResources = savedReadResourcesString ? JSON.parse(savedReadResourcesString) : [];
  //   setReadResources(savedReadResources);
    
  // }, []);

  // Function to mark a resource as read
  const handleMarkAsRead = (resource) => {
    const userConfirmed = window.confirm('You want to mark as read?');
    // Add the resource to the array if it's not already there
    let update=[];
    if (userConfirmed & !readResources.includes(resource)) {
      update = [...readResources, resource];
      window.alert(`Resource: ${resource}, marked as read.`);
      setReadResources(update);
      //localStorage.setItem('readResources', JSON.stringify(update));
    }
    else if (userConfirmed & readResources.includes(resource)){
      if(window.confirm(`Resource: ${resource}, is already marked as read, want to unmark?`)){
        update = readResources.filter(item => item !== resource);
        setReadResources(update);
        //localStorage.setItem('readResources', JSON.stringify(update));
        window.alert(`Resource: ${resource}, marked as unread`);
      }
      
    }
    
    // Save to localStorage
    //localStorage.setItem('readResources', JSON.stringify(update));
  };
  //####################################################################################################

  useEffect(() => {
    const fetchResourceData = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/resources/${id}`); // Use 'id' from URL params
        const data = await response.json();
        setName(data.Name);
        setPdfFile(data.pdfUrl);
        setVideoFile(data.videoUrl);
        setAudioFile(data.audioUrl);
        setBrief(data.Brief)
        setSummaryText(data.summaryText);
        setReleaseInfo(data.releaseInfo);
        
      } catch (error) {
        console.error('Error fetching resource data:', error);
      }
    };

    fetchResourceData();
  }, [id]); // Run the useEffect whenever 'id' changes


  const closeModal = () => setShowModal(null);

  const handleNotesChange = (content) => {
    setNotes(content);
  };

  const handleSaveNotes = () => {
    // Convert HTML to plain text
    const plainText = htmlToText(notes, {
      wordwrap: 130 // Adjust as needed
    });

    // Generate PDF
    const doc = new jsPDF();
    doc.text(plainText, 10, 10);
    
    // Save PDF
    const pdfFileName = 'Notes.pdf';
    doc.save(pdfFileName);

    // Optionally, update the summaryText if needed
    setSummaryText(plainText);
    alert('Notes saved and PDF generated!');
  };

  const elements = readResources.map((element, index) => (
    <span key={index}>
      {element}
      <br />
    </span>
  ));

  return (
    <div className="pdf-view-page">

      {/* Full PDF Viewer */}
      <div className="pdf-and-notes-container">
        <div className="pdf-viewer">
          {pdfFile ? (
            <iframe src={pdfFile} width="100%" height="600px" title="PDF Viewer" />
          ) : (
            <p>Resource not uploaded</p>
          )}
        </div>

        {/* Take Notes Section */}
        <div className="notes-section">
          <button className="take-notes-button" onClick={() => setShowNotes(!showNotes)}>
            Take Notes
          </button>
          {showNotes && (
            <div className="notes-editor">
              <ReactQuill
                value={notes}
                onChange={handleNotesChange}
                placeholder="Start writing your notes here..."
                modules={{ toolbar: toolbarOptions }} // Add the custom toolbar
              />
              <button onClick={handleSaveNotes} className="save-notes-button">
                Save Notes
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Media Buttons */}
      <div className="media-buttons">
        <button onClick={() => setShowModal('video')}>View Video</button>
        <button onClick={() => setShowModal('audio')}>Listen to Audio</button>
        {/*<button onClick={() => setShowModal('summary')}>View Summary</button>*/}
        <button onClick={() => {setShowModal('summary'); }}>View Notes</button> {/* Call fetchAISummary */}

        <button onClick={() => handleMarkAsRead(Name)}>
            Mark as read
        </button> {/*here you can create a method that on click it stores resources in aarray then do as you please with*/}
          
        <Link to={`/take-quiz/${id}`}>
          <button>Take Quiz</button>
        </Link>
      </div>

      

      {/* Details Section */}
      <div className="details-section">
        <h3>Brief Explanation</h3>
        <p>{Brief? Brief : 'Summary not available'}</p>
        <h4>Released by:</h4>
        <p>{releaseInfo ? releaseInfo : 'Releaser info not available'}</p>
        <h4>Resources read:</h4>
        <p>{elements}</p>
      </div>

      {/* Modal for Video/Audio/Summary */}
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <span className="close-btn" onClick={closeModal}>
              &times;
            </span>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
            {showModal === 'video' ? (
              videoFile ? (
                <video width="800"  controls>
                  
                  <source src={videoFile} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              ) : (
                <p>Resource not uploaded</p>
              )
            ) : showModal === 'audio' ? (
              audioFile ? (
                <audio controls>
                  <source src={audioFile} type="audio/mp3" />
                  Your browser does not support the audio tag.
                </audio>
              ) : (
                <p>Resource not uploaded</p>
              )
            ) : (
              <div>
                <h3>Your Notes</h3>
                <p>{summaryText ? summaryText : 'Your notes will appear here after saving.'}</p>
              </div>
            )}
            </div>

            {/* Download Button */}
            {showModal !== 'summary' && (
              <a
                href={showModal === 'video' ? videoFile : audioFile}
                download
                className="download-btn"

                style={{
                  display: 'inline-block',
                  padding: '10px 20px',
                  color: 'white',
                  textAlign: 'center',
                  textDecoration: 'none',
                  borderRadius: '5px'
                }}
              >
                Download {showModal === 'video' ? 'Video' : 'Audio'}
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PdfViewPage;
