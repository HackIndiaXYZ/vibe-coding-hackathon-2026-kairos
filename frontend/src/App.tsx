import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";
import Risks from "./pages/Risks";
import Identities from "./pages/Identities";
import Accounts from "./pages/Accounts";
import Profile from "./pages/Profile";
import Graph from "./pages/Graph";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Both endpoints now cleanly map to the Login component */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />

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
        <Route
          path="/graph"
          element={<Graph />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;