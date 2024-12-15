import React from 'react';
import ReactDOM from 'react-dom';

// import logo from './logo.svg';
import './App.css';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // Importer BrowserRouter et Routes
import Home from './page/Home';

function App() {
  return (
    <div className="App">
      <Router> {/* Envelopper votre application avec Router */}
        <Routes> {/* Utilisez Routes pour définir vos routes */}
          <Route path="/" element={<Home />} />
        </Routes>
      </Router>   
    </div>
  );
}

export default App;
