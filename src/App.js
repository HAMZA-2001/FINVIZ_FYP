
import './App.css';
import Header from './Header';
import App2 from './App2';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from './components/Dashboard';
import StockContext from './components/StockContext';
import Signup from './Authentication/Signup';
import Login from './Authentication/Login'
import AuthenticationPage from './Authentication/AuthenticationPage';
import { useState } from 'react';
import { AuthProvider } from './Authentication/context/AuthContext';
import PrivateRoute from './PrivateRoute';
import UserProfile from './UserProfiling/UserProfile';
import UserPortfolio from './Portfolio/UserPortfolio';
import StockPortfolioContext from './Portfolio/StockPortfolioContext';

function App() {
  const [stockSymbol, setStockSymbol] = useState("FB")
   const [portfoliostockSymbol, setportfoliostockSymbol] = useState("")
  return (
    <Router>
      <AuthProvider>
        <div className="App">
        
        <Routes>

          <Route path='/signup' element={
          <div>
            {/* <AuthProvider> */}
              <Signup/>
            {/* </AuthProvider> */}
            
          </div>}/>

          <Route path='/login' element={
          <div>
            {/* <AuthProvider> */}
              <Login/>
            {/* </AuthProvider> */}
            
          </div>}/>

          <Route path="/viz" element={
            <PrivateRoute>
            <div className='app__header'>
            <Header/>
            <App2/>
          </div>
          </PrivateRoute>
          }/> 

        <Route path="/userprofile" element={
            <PrivateRoute>
            <div className='app__header'>
            <Header/>
            <UserProfile/>
          </div>
          </PrivateRoute>
          }/> 

        <Route path="/portfolio" element={
            <PrivateRoute>
            <StockPortfolioContext.Provider value={{portfoliostockSymbol, setportfoliostockSymbol}}>
            <div className='app__header'>
              <Header/>
              <UserPortfolio/>
            </div>
           </StockPortfolioContext.Provider>
          </PrivateRoute>
          }/>

          <Route path="/" element={
            <div>
            <PrivateRoute>
              <StockContext.Provider value={{stockSymbol, setStockSymbol}}>
                <Header/>
                <Dashboard/>
              </StockContext.Provider>
            </PrivateRoute>
            </div>
            } /> 

        </Routes>   
          
      </div>
      </AuthProvider>
  </Router>



  );
}

export default App;
