import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import RecipeApp from "./components/RecipeApp";
import SignupForm from "./components/SignupForm";
import Login from "./components/Login";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App = () => (
  <Router>
    <ToastContainer />
    <Routes>
      <Route path="/" element={<RecipeApp />} />
      <Route path="/signup" element={<SignupForm />} />
      <Route path="/signin" element={<Login />} />
    </Routes>
  </Router>
);


export default App;
