//NEW APP
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { MsalProvider } from '@azure/msal-react';
import { msalInstance } from './config/authConfig';

createRoot(document.getElementById("root")!).render(
  <MsalProvider instance={msalInstance}>
    <App />
  </MsalProvider>
);
//-----------------

//OLD APP
// import { createRoot } from "react-dom/client";
// import App from "./App.tsx";
// import "./index.css";
// import { MsalProvider } from '@azure/msal-react';
// import { msalInstance } from './config/authConfig';

// createRoot(document.getElementById("root")!).render(
//   <MsalProvider instance={msalInstance}>
//     <App />
//   </MsalProvider>
// );

//INITIAL

  // import { createRoot } from "react-dom/client";
  // import App from "./App.tsx";
  // import "./index.css";

  // createRoot(document.getElementById("root")!).render(<App />);

