
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

function App() {
  const [stockSymbol, setStockSymbol] = useState("FB")
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

          <Route path="/" element={
            <div>
            <PrivateRoute>
              <StockContext.Provider value={{stockSymbol, setStockSymbol}}>
                <Header/>
                <Dashboard/>
              </StockContext.Provider>
            </PrivateRoute>
            {/* <StockContext.Provider value={{stockSymbol, setStockSymbol}}>
              <Header/>
              <Dashboard/>
            </StockContext.Provider> */}
            </div>
            } /> 

        </Routes>   
          
      </div>
      </AuthProvider>
  </Router>



  );
}

export default App;
