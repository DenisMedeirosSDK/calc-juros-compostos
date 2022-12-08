import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { RoutesPages } from "./routes";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <RoutesPages />
  </React.StrictMode>
);
