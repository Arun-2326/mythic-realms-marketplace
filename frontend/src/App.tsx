import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import DebugPage from "./pages/DebugPage";
import MarketplacePage from "./pages/MarketplacePage";

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-slate-900 text-white">
        <Navbar />
        <Routes>
          <Route path="/" element={<MarketplacePage />} />
          <Route path="/debug" element={<DebugPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;