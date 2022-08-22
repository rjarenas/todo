import './App.css';
import * as React from 'react';
import TaskInterface from './TaskInterface.js'

function App() {
  return (
    <React.Fragment>
      <head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </head>
      <main>
        <TaskInterface />
      </main>
    </React.Fragment>
  );
}

export default App;
