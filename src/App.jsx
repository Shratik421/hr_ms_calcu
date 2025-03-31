import { useState } from "react";

import { Toaster } from "react-hot-toast";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import SalaryManagement from "./SalaryManagement";
import SalaryCalculator from "./SalaryCalculator";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <Router>
        <Routes>
          <Route path="/salary" element={<SalaryManagement />} />
          <Route path="/" element={<SalaryCalculator />} />
        </Routes>
        <Toaster position="top-right" />
      </Router>
    </>
  );
}

export default App;
