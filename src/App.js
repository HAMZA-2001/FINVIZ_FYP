
import './App.css';
import Header from './Header';
import App2 from './App2';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from './components/Dashboard';

function App() {
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
            <Header/>
            <Dashboard/>
          
          </div>
            
          } /> 
      </Routes>      
    </div>
  </Router>



  );
}

export default App;
