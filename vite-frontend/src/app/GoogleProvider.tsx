import type { ReactNode } from "react";
import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";
import type { Theme } from "../useTheme";

export default function GoogleProvider({
  children,
  language,
  theme,
}: {
  children: ReactNode;
  language: string;
  theme: Theme;
}) {
  return (
    <GoogleReCaptchaProvider
      reCaptchaKey={"6Le94aorAAAAAIdMdjq8GTOSacjuhGfEknLObbM9"}
      language={language}
      container={{
        parameters: { badge: "bottomright", theme: theme },
        element: "google-captcha",
      }}
    >
      {children}
    </GoogleReCaptchaProvider>
  );
}
