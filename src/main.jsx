import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { inject } from "@vercel/analytics"
import { Analytics } from "@vercel/analytics/react";

inject()

ReactDOM.createRoot(document.getElementById("root")).render(
  <>
    <Analytics/>
    <App />
  </>
);
