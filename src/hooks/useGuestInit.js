import { useEffect, useState } from "react";
import { initGuest } from "../api/guest";

export function useGuestInit() {
  const [guest, setGuest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    initGuest()
      .then((d) => mounted && setGuest(d))
      .catch((e) => mounted && setError(e))
      .finally(() => mounted && setLoading(false));
    return () => { mounted = false; };
  }, []);

  return { guest, loading, error };
}
