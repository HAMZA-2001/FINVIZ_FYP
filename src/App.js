
import './App.css';
import Header from './Header';
import App2 from './App2';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from './components/Dashboard';
import StockContext from './components/StockContext';
import { useState } from 'react';

function App() {
  const [stockSymbol, setStockSymbol] = useState("FB")
  return (
    <Router>
    <div className="App">
      
      <Routes>
        <Route path='/' element={
        <div>
          <div className='app__header'>
          <Header/>
          </div>
          <div className='app__body'>
          <div className="app__container">
          {/* <NewsFeed />
          <Stats /> */}
        </div>
          </div>
        </div>}

        />
        <Route path="/viz" element={
          <div className='app__header'>
          <Header/>
          <App2/>
         </div>}/> 

         <Route path="/d" element={
          <div>
          <StockContext.Provider value={{stockSymbol, setStockSymbol}}>
            <Header/>
            <Dashboard/>
          </StockContext.Provider>
          </div>
            
          } /> 
      </Routes>      
    </div>
  </Router>



  );
}

export default App;
