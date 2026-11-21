import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import BookDetail from "./pages/BookDetail";

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/books/:id" element={<BookDetail />} />
    </Routes>
  );
}

export default App;
