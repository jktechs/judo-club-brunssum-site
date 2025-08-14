import { useEffect, useState } from "react";

export type Theme = "light" | "dark";

export default function useTheme() {
  const query = "(prefers-color-scheme: dark)";
  const [theme, setTheme] = useState<Theme>(
    window.matchMedia(query).matches ? "dark" : "light",
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia(query);

    const handler = (e: MediaQueryListEvent) =>
      setTheme(e.matches ? "dark" : "light");
    mediaQuery.addEventListener("change", handler);

    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  return theme;
}
