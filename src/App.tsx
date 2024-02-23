import React from 'react';
import './App.css';
import MyComponent from './components/MyComponent';

function App() {
  return (
    <div className="App"
      style={{
        width: '100%',
        height: '100vh  ',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <div>
        <h1>Test</h1>
        <div>
          <MyComponent />
        </div>
      </div>
    </div>
  );
}

export default App;
