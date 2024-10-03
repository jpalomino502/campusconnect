// src/components/Profile/LoadingSkeleton.js

import React from 'react';

const LoadingSkeleton = () => {
  return (
    <div className="animate-pulse flex space-x-4">
      <div className="rounded-full bg-gray-200 h-12 w-12"></div>
      <div className="flex-1 space-y-4 py-1">
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        <div className="h-4 bg-gray-200 rounded"></div>
        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
      </div>
    </div>
  );
};

export default LoadingSkeleton;
