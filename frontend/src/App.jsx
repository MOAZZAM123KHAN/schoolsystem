import { Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import RequireAuth from "./components/RequireAuth";
import Layout from "./components/Layout";
import LoginPage from "./pages/LoginPage";
import SchoolPage from "./pages/SchoolPage";
import StudentsPage from "./pages/StudentsPage";
import ReportCardsPage from "./pages/ReportCardsPage";

export default function App() {
  return (
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />

          {/* Everything below needs a login */}
          <Route element={<RequireAuth />}>
            <Route element={<Layout />}>
              <Route path="/" element={<Navigate to="/school" replace />} />
              <Route path="/school" element={<SchoolPage />} />
              <Route path="/students" element={<StudentsPage />} />
              <Route path="/students/:id" element={<StudentsPage />} />
              <Route path="/cards" element={<ReportCardsPage />} />
            </Route>
          </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  );
}
