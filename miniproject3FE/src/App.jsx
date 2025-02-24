// src/App.jsx

import { BrowserRouter as Router } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import AppRoutes from "./routes/Routes"; // Importing the Routes component

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes /> 
      </Router>
    </AuthProvider>
  );
}

export default App;

