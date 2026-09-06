import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import DebugPage from "./pages/DebugPage";
import MarketplacePage from "./pages/MarketplacePage";
import MintPage from "./pages/MintPage";

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-slate-900 text-white">
        <Navbar />

        <Routes>
          <Route path="/" element={<MarketplacePage />} />
          <Route path="/mint" element={<MintPage />} />
          <Route path="/debug" element={<DebugPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;