import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import AppWrapper from "./AppWrapper"
import "./styles/global.css";
import "./styles/modals/mypage.css";
import "./styles/pages/main.css";



const App: React.FC = () => {


  return (
    <Router>
      <AppWrapper />
    </Router>
  );
};

export default App;
