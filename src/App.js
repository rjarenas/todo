import './App.css';
import * as React from 'react';
import TaskCard from './containers/TaskCard';

function App() {
  return (
    <React.Fragment>
      <head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </head>
      <main>
        <TaskCard user_id = "1"/>
      </main>
    </React.Fragment>
  );
}

export default App;
