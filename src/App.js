import './App.css';
import Header from './Header';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from './components/Dashboard';
import StockContext from './components/StockContext';
import Signup from './Authentication/Signup';
import Login from './Authentication/Login'
import AuthenticationPage from './Authentication/AuthenticationPage';
import { useState } from 'react';
import { AuthProvider } from './Authentication/context/AuthContext';
import PrivateRoute from './PrivateRoute';
import UserPortfolio from './Portfolio/UserPortfolio';
import StockPortfolioContext from './Portfolio/StockPortfolioContext';
import * as userService from './Portfolio/constants/UserForm/userService'
import PortfolioSummary from './PortfolioTracker/PortfolioSummary';
import MachineLearningModel from './MachineLearning/MachineLearningModel';
import AnalysisPage from './Analysis/AnalysisPage';
import VisualizationPage from './MainVisualization/VisualizationPage';

/**
 * core of the website
 * @returns skeleton of the application
 */
function App() {
  const [stockSymbol, setStockSymbol] = useState("FB")
   const [portfoliostockSymbol, setportfoliostockSymbol] = useState("")
   const [Results, setResults] = useState(userService.getAllUsers)
  return (
    <Router>
      <AuthProvider>
        <div className="App">
        
        <Routes>

          <Route path='/signup' element={
          <div>
              <Signup/>  
          </div>}/>

          <Route path='/login' element={
          <div>
              <Login/>   
          </div>}/>

          <Route path="/viz" element={
            <PrivateRoute>
            <div className='app__header'>
            <Header/>
            <VisualizationPage/>
          </div>
          </PrivateRoute>
          }/> 

        <Route path="/analysis" element={
            <PrivateRoute>
            <div className='app__header'>
            <Header/>
            <AnalysisPage/>
          </div>
          </PrivateRoute>
          }/> 

        <Route path="/ml" element={
            <PrivateRoute>
            <div className='app__header'>
              <Header/>
              <MachineLearningModel/>
          </div>
          </PrivateRoute>
          }/> 

        <Route path="/portfolio" element={
            <PrivateRoute>
            <StockPortfolioContext.Provider value={{portfoliostockSymbol, setportfoliostockSymbol, Results, setResults}}>
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

        <Route path="/tracker" element={
            <div>
            <PrivateRoute>
                <Header/>
                <PortfolioSummary/>
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
