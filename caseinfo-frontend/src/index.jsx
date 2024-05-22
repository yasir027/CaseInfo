import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom'; // Import BrowserRouter
import App from './App';

// Find the root element in your HTML
const rootElement = document.getElementById('root');
const root = ReactDOM.createRoot(rootElement);

// Render your App component wrapped in BrowserRouter
root.render(
	<React.StrictMode>
		<BrowserRouter> {/* Wrap the App component inside BrowserRouter */}
			<App />
		</BrowserRouter>
	</React.StrictMode>
);
