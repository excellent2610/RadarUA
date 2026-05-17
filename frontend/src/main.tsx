import React from "react";
import ReactDOM from "react-dom/client";
import "leaflet/dist/leaflet.css";
import "./styles/index.css";
import "./styles/mobile.css";
import { App } from "./App";
import { initTelegramWebApp } from "./lib/telegram/telegram";
import "./i18n";

initTelegramWebApp();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
