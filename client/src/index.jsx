import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter as Router, Routes, Route, } from "react-router-dom";
import Dashbord from './Dashboard';
import SearchOwner from './screen/SearchOwner';
import Product from './screen/Product';
import User from './screen/User';
import Employee from './screen/Employee';
import Position from './screen/Position';
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
   <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/dashboard" element={<Dashbord />} />
        <Route path="/product" element={<Product />} />
        <Route path="/owner" element={<SearchOwner />} />
        <Route path="/user" element={<User />} />
        <Route path="/employee" element={<Employee />} />
        <Route path="/position" element={<Position />} />
      </Routes>
    </Router>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();