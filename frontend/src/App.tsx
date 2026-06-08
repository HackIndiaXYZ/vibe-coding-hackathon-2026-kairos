import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";
import Risks from "./pages/Risks";
import Identities from "./pages/Identities";
import Accounts from "./pages/Accounts";
import Profile from "./pages/profile";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />

        <Route
          path="/dashboard"
          element={<Dashboard />}
        />

        <Route
          path="/risks"
          element={<Risks />}
        />
        <Route
          path="/identities"
          element={<Identities />}
        />
        <Route
          path="/accounts"
          element={<Accounts />}
        />
        <Route
          path="/profile"
          element={<Profile />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;