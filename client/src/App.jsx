import { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { About } from "./pages/About";
import { Home } from "./pages/Home";
import { Signin } from "./pages/Signin";
import { Signup } from "./pages/Signup";
import { Header } from "./components/Header";
import { PrivateRoute } from "./components/PrivateRoute";
import { Profile } from "./pages/Profile";
import { CreateListing } from "./pages/CreateListing";

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/signin" element={<Signin />} />
        <Route element={<PrivateRoute />}>
          <Route path="/profile" element={<Profile />} />
          <Route path="/listing" element={<CreateListing />} />
        </Route>
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </Router>
  );
}

export default App;
