
-------------------------------------------------------------------------------------------------------
Project Structure

├── public
│   ├── index.html       # Main HTML template
├── src
│   ├── components       # React components
│   │   ├── Header.js    # Header with logout functionality
│   │   ├── Chatbot.js   # Chatbot component for resource suggestions
│   │   ├── PDFView.js   # Page to view PDFs with extra features
│   │   ├── QuizPage.js  # Page to take quizzes related to resources
│   │   ├── NoteTaking.js # Component to take and save notes
│   └── App.js           # Main App component
├── database.js          # MongoDB schema and resource management
├── .env                 # Environment variables (Google Cloud, MongoDB credentials)
├── README.md            # Project documentation
└── package.json         # Project dependencies and scripts

NB: There are more css files and other sub components inside.

--------------------------------------------------------------------------------------------------------

Installation - the following is if you are intending to run the app.

Prerequisites
	1.Node.js: Ensure that Node.js is installed.
	2.MongoDB: Set up a MongoDB instance for storing user and resource data.
	3.Google Cloud Storage: You need a Google Cloud Storage bucket for storing the resources 
	(PDFs, videos, audio).

Steps
	1.Clone the repository:
	
	2.Install dependencies:
		npm install
		
	3.Set up environment variables:
		Create a .env file in the project root and add the following:
		
	NB: we can't provide our secret API Keys here!!!!!!!!!!!!!!!!!!!
	
	4.Run the app:
		npm start
		
	NB: Automatically you can't run the App without our API keys, since you have to run the server first
		so that you can be able to Log in!!!!!!
----------------------------------------------------------------------------------------------------------

For any questions or feedback, feel free to reach out at:


