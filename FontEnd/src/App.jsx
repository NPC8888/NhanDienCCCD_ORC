import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import { Toaster } from "react-hot-toast";

import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import About from "./pages/About";
import Storage from "./pages/Storage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Scan from "./pages/Scan";
import Records from "./pages/Records";
import RecordDetail from "./pages/RecordDetail";
import Search from "./pages/Search";
import CreateRecord from "./pages/CreateRecord";

function App() {
  return (
    <div className="app">
      <Navbar />
      <div className="page">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Routes */}
          <Route path="/storages" element={
            <ProtectedRoute>
            <Storage />
          </ProtectedRoute>
        } />
        <Route path="/scan" element={
          <ProtectedRoute>
            <Scan />
          </ProtectedRoute>
        } />
        <Route path="/records" element={
          <ProtectedRoute>
            <Records />
          </ProtectedRoute>
        } />
        <Route path="/record/:recordId" element={
          <ProtectedRoute>
            <RecordDetail />
          </ProtectedRoute>
        } />
        <Route path="/search" element={
          <ProtectedRoute>
            <Search />
          </ProtectedRoute>
        } />
        <Route path="/create-record" element={
          <ProtectedRoute>
            <CreateRecord />
          </ProtectedRoute>
        } />
      </Routes>
      </div>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: 'rgba(0, 0, 0, 0.8)',
            color: '#f3f4f6',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            backdropFilter: 'blur(10px)',
          },
          success: {
            iconTheme: {
              primary: '#64d5ff',
              secondary: '#0b0f17',
            },
          },
          error: {
            iconTheme: {
              primary: '#ff4757',
              secondary: '#f3f4f6',
            },
          },
        }}
      />
    </div>
  );
}

export default App;