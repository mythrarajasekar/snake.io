import React from 'react';
import { DotCollectorPage } from './';

// Responsibility: Example integration showing how to wire the module into an App.
// Place this code inside your application's `App.tsx` to try the feature locally.
export function AppExample() {
  return (
    <div style={{ padding: 16 }}>
      <h1>My App — Dot Collector Demo</h1>
      <DotCollectorPage />
    </div>
  );
}

export default AppExample;
