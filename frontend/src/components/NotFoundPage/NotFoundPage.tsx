import React from 'react';
import { Link } from 'react-router-dom';
import './not-found-page.css';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="notfound-page">
      <h1>404</h1>
      <p>Page not found</p>
      <Link to="/" className="home-link">Return Home</Link>
    </div>
  );
};
