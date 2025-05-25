import React, { useState, useEffect } from 'react';

// Stagewise wrapper component for proper React context
const StagewiseWrapper: React.FC = () => {
  const [StagewiseToolbar, setStagewiseToolbar] = useState<React.ComponentType<any> | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Only load in development mode
    if (process.env.NODE_ENV !== 'development') {
      setIsLoading(false);
      return;
    }

    // Dynamic import for better React context handling
    const loadStagewise = async () => {
      try {
        const stagewiseModule = await import('@stagewise/toolbar-react');
        setStagewiseToolbar(() => stagewiseModule.StagewiseToolbar);
      } catch (error) {
        console.warn('Stagewise toolbar not available:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadStagewise();
  }, []);

  // Don't render anything if not in development or still loading
  if (process.env.NODE_ENV !== 'development' || isLoading || !StagewiseToolbar) {
    return null;
  }

  const stagewiseConfig = {
    plugins: []
  };

  return <StagewiseToolbar config={stagewiseConfig} />;
};

export default StagewiseWrapper; 