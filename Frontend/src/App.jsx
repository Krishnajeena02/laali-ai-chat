import { BrowserRouter, Routes, Route } from "react-router-dom";
import LaaliChat from "./pages/LaaliChat.jsx";
import Name from "./pages/Name.jsx";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Name />} />
        <Route path="/chat" element={<LaaliChat />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;