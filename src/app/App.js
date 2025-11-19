import "./App.css";

import Home from "../pages/home";
import { useGuestInit } from "../hooks/useGuestInit";

function App() {
  const { guest, loading, error } = useGuestInit();

  return <Home guest={guest} guestLoading={loading} guestError={error} />;
}

export default App;
