import { useEffect, useState } from "react";
import { fetchHealth, type HealthResponse } from "../api/client";

type HealthState =
  | { loading: true }
  | { loading: false; data: HealthResponse }
  | { loading: false; error: string };

export function useHealth(): HealthState {
  const [state, setState] = useState<HealthState>({ loading: true });

  useEffect(() => {
    let active = true;
    fetchHealth().then(
      (data) => {
        if (active) setState({ loading: false, data });
      },
      (error: unknown) => {
        if (active) {
          setState({
            loading: false,
            error: error instanceof Error ? error.message : "The API is unavailable.",
          });
        }
      },
    );
    return () => {
      active = false;
    };
  }, []);

  return state;
}
