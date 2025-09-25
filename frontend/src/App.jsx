import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Issues from './pages/Issues';
import IssueView from './pages/IssueView';
import ReportIssue from './pages/ReportIssue';
import AdminDashboard from './pages/AdminDashboard';
import About from './pages/About';
import Contact from './pages/Contact';
import Resources from './pages/Resources';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/issues" element={<Issues />} />
          <Route path="/issue/:id" element={<IssueView />} />
          <Route path="/report" element={<ReportIssue />} />
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute roles={['admin', 'authority']}>
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />
          <Route path="/resources" element={<Resources />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;