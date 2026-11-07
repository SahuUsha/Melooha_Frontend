
import { BrowserRouter, Routes, Route } from "react-router-dom";

import LandingPage from "./pages/LandingPage";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import BirthDetailsPage from "./pages/BirthDetailsPage";
import DashboardPage from "./pages/DashboardPage";
import BirthChartPage from "./pages/BirthChartPage";
import AskMeloohaPage from "./pages/AskMeloohaPage";
import HistoryPage from "./pages/HistoryPage";
import QuestionCreditsPage from "./pages/QuestionCreditsPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />

        <Route
          path="/onboarding/birth-details"
          element={<BirthDetailsPage />}
        />

        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/dashboard/chart" element={<BirthChartPage />} />
        <Route path="/dashboard/ask" element={<AskMeloohaPage />} />
        <Route path="/dashboard/history" element={<HistoryPage />} />
        <Route
    path="/dashboard/credits"
    element={<QuestionCreditsPage />}
/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
