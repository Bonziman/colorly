// src/components/Loading.tsx
import React from 'react';
import './styles/Loading.css';

const Loading: React.FC = () => (
  <div className="loading-container">
    <div className="spinner"></div>
    <p>Loading...</p>
  </div>
);

export default Loading;
