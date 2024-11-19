import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "./CSS/Components/loading.css";
import "./plugins/fontawesome-free/css/all.min.css";
import GlobalVarProvider from "./Pages/Website/Context/Context.js";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter as Router } from "react-router-dom";
import MenuContext from "./Context/MenuContext.js";
import WindowContext from "./Context/WindowContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <GlobalVarProvider>
      <WindowContext>
        <MenuContext>
          <Router>
            <App />
          </Router>
        </MenuContext>
      </WindowContext>
    </GlobalVarProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
