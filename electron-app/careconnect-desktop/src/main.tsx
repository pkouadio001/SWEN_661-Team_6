import React from "react";
import ReactDOM from "react-dom/client";
import { HashRouter } from "react-router-dom";
import App from "./app/App";
import "./styles/app.css";
import { ActivitiesProvider } from "./state/activitiesStore";


ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
   <ActivitiesProvider>
      <HashRouter>
           <App />
      </HashRouter>
   </ActivitiesProvider>
  </React.StrictMode>
);