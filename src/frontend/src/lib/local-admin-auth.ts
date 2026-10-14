import { useCallback, useEffect, useState } from "react";

async function getStatus(): Promise<boolean> {
  const response = await fetch("/api/auth/status", { credentials: "include" });
  if (!response.ok) throw new Error("Unable to check administrator sign-in.");
  const body = (await response.json()) as { authenticated: boolean };
  return body.authenticated;
}

export function useLocalAdminAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;
    getStatus()
      .then((authenticated) => {
        if (active) setIsAuthenticated(authenticated);
      })
      .catch((error: unknown) => {
        console.error(error);
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const login = useCallback(async (password: string) => {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    const body = (await response.json()) as { error?: string };
    if (!response.ok) throw new Error(body.error ?? "Sign-in failed.");
    setIsAuthenticated(true);
  }, []);

  const logout = useCallback(async () => {
    const response = await fetch("/api/auth/logout", {
      method: "POST",
      credentials: "include",
    });
    if (!response.ok) throw new Error("Sign-out failed.");
    setIsAuthenticated(false);
  }, []);

  return { isAuthenticated, isLoading, login, logout };
}
