import React from "react";
import "./styles/App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { MainPage } from "./pages/MainPage";
import { HistoryPage } from "./pages/HistoryPage";
import AppNavigation from "./components/Navigation";

const App: React.FC = () => {
  return (
    <Router>
      <div className="App">
        <AppNavigation />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<MainPage />} />
            <Route path="/history" element={<HistoryPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;
