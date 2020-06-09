import React from 'react';
import './App.css';
import { BrowserRouter, Route } from 'react-router-dom';
import Main from './main/Main';

function App() {

  
  return (
    <BrowserRouter>
      <Route path='/:competitionName?/:eventId?'>
        <Main className="App"/>
      </Route>
    </BrowserRouter>
  )
}

export default App;
