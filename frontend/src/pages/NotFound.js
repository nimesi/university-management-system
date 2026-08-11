import React from 'react';

const NotFound = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-br from-blue-600 to-blue-800">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-white mb-4">404</h1>
        <p className="text-2xl text-gray-200 mb-8">Page Not Found</p>
        <a href="/" className="btn btn-primary">
          Go to Dashboard
        </a>
      </div>
    </div>
  );
};

export default NotFound;
