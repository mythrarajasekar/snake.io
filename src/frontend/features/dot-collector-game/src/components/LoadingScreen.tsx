import React, { useState, useEffect } from 'react';

const LoadingScreen: React.FC = () => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <div className="dcg-loading-screen">
      <div className="dcg-loading-spinner" />
      <div className="dcg-loading-text">Loading snake.io...</div>
    </div>
  );
};

export default LoadingScreen;
