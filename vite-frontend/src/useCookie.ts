import { useState, useEffect, useCallback } from "react";
import Cookies from "js-cookie";

export default function useCookie(name: string) {
  const [cookie, setValue] = useState(() => Cookies.get(name));

  useEffect(() => {
    if (cookie !== undefined) {
      Cookies.set(name, cookie, { expires: 365 }); // Save whenever it changes
    }
  }, [name, cookie]);

  const setCookie = useCallback((newValue: string) => {
    setValue(newValue);
  }, []);

  return { cookie, setCookie };
}
