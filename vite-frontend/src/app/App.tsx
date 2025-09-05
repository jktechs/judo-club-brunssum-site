import { TEXT_MAP, capitalize } from "../translation";
import "./App.css";
import facebook from "./facebook.svg";
import instagram from "./instagram.svg";
import whatsapp from "./whatsapp.svg";
import language_icon from "./language.svg";
import theme_icon from "./theme.svg";
import { useQuery } from "@apollo/client";
import {
  Link,
  Navigate,
  Outlet,
  useLocation,
  useParams,
} from "react-router-dom";
import { languages } from "../../../global";
import useCookie from "../useCookie";
import useTheme, { type Theme } from "../useTheme";
import { APP_QUERY } from "../queries";
import GoogleProvider from "./GoogleProvider";

type MenuItem = { label: string; links: { label: string; href: string }[] };
export default function App() {
  const preferdTheme = useTheme();
  const { cookie: themeCookie = preferdTheme, setCookie: setThemeCookie } =
    useCookie("theme");
  const { language = "nl" } = useParams();
  const location = useLocation();
  const start = location.pathname.substring(1).indexOf("/");
  const path = location.pathname.substring(start + 1);
  const { error, data } = useQuery(APP_QUERY, {
    variables: { language },
  });
  if (!["en", "nl"].includes(language)) {
    if (start === -1) {
      return <Navigate to={"/"} />;
    } else {
      return <Navigate to={"/nl" + path} />;
    }
  }
  if (error !== undefined) {
    console.error(JSON.stringify(error));
  }
  return (
    <GoogleProvider language={language} theme={themeCookie as Theme}>
      <div data-theme={themeCookie}>
        <header>
          <nav className="container">
            <Link to={"/" + language + "/info/home"}>
              <img src="/logo.png" className="logo icon big" />
              <img src="/logo-small.png" className="logo icon small" />
            </Link>
            <ul id="navbar">
              <li>
                <Link to={"/" + language + "/info/home"} className="secondary">
                  Home
                </Link>
              </li>
              {data !== undefined ? (
                <NavBar
                  language={language}
                  menuItems={data.menuItems}
                  path={path}
                  setThemeCookie={setThemeCookie}
                />
              ) : (
                <article aria-busy="true" />
              )}
            </ul>
            <input id="menu-button" type="checkbox" />
          </nav>
        </header>
        <main className="container">
          <Outlet />
        </main>
        <footer className="container">
          <nav>
            <Footer />
          </nav>
        </footer>
      </div>
      <div id="google-captcha" />
    </GoogleProvider>
  );
}
type NavBarProps = {
  language: string;
  path: string;
  menuItems: MenuItem[];
  setThemeCookie: (newValue: string) => void;
};
function NavBar({ language, menuItems, path, setThemeCookie }: NavBarProps) {
  return (
    <>
      {menuItems.map((item) => {
        if (item.links.length == 1) {
          return (
            <li key={item.label}>
              <Link
                role="button"
                to={"/" + language + item.links[0].href}
                className="secondary outline"
              >
                {item.links[0].label}
              </Link>
            </li>
          );
        } else {
          return (
            <li key={item.label}>
              <details className="dropdown" key={item.label}>
                <summary role="button" className="secondary outline">
                  {item.label}
                </summary>
                <ul dir="rtl">
                  {item.links.map((link) => (
                    <li key={link.label}>
                      <Link to={"/" + language + link.href}>{link.label}</Link>
                    </li>
                  ))}
                </ul>
              </details>
            </li>
          );
        }
      })}
      <li>
        <details className="dropdown">
          <summary role="button" className="outline">
            <img className="icon" src={language_icon} />
          </summary>
          <ul dir="rtl">
            {languages.map((language) => (
              <li key={language.code}>
                <Link to={"/" + language.code + path}>{language.name}</Link>
              </li>
            ))}
          </ul>
        </details>
      </li>
      <li>
        <details className="dropdown">
          <summary role="button" className="outline">
            <img className="icon" src={theme_icon} />
          </summary>
          <ul dir="rtl">
            <li>
              <a onClick={() => setThemeCookie("light")}>
                {capitalize(TEXT_MAP["light"][language])}
              </a>
            </li>
            <li>
              <a onClick={() => setThemeCookie("dark")}>
                {capitalize(TEXT_MAP["dark"][language])}
              </a>
            </li>
          </ul>
        </details>
      </li>
      {/*<li>
        <details className="dropdown">
          <summary role="button" className="outline"></summary>
          <ul dir="rtl">
            <li>
              <details className="nested-dropdown">
                <summary style={{ width: "max-content" }}>
                  {capitalize(TEXT_MAP["theme"][language])}
                </summary>
                <a onClick={() => setThemeCookie("light")}>
                  {capitalize(TEXT_MAP["light"][language])}
                </a>
                <a onClick={() => setThemeCookie("dark")}>
                  {capitalize(TEXT_MAP["dark"][language])}
                </a>
              </details>
            </li>
            <li>
              <details className="nested-dropdown">
                <summary style={{ width: "max-content" }}>
                  {capitalize(TEXT_MAP["language"][language])}
                </summary>
                {languages.map((language) => (
                  <Link key={language.code} to={"/" + language.code + path}>
                    {language.name}
                  </Link>
                ))}
              </details>
            </li>
          </ul>
        </details>
      </li>*/}
    </>
  );
}
function Footer() {
  return (
    <>
      <article>
        <hgroup>
          <h6>Social media</h6>
          <Link to="https://www.facebook.com/JCBrunssum/">
            <img className="social-logo" src={facebook} />
          </Link>
          <Link to="https://www.instagram.com/judoclub_brunssum/">
            <img className="social-logo" src={instagram} />
          </Link>
          <Link to="#">
            <img className="social-logo" src={whatsapp} />
          </Link>
        </hgroup>
      </article>
      <article>
        <hgroup>
          <h6>Contact gegevens</h6>
          <p>
            Regentessestraat 47, 6441 GD Brunssum
            <br />
            {"Telefoon: "}
            <a href="tel:0031622433444">06 - 22 43 34 44</a>
            <br />
            {"Email: "}
            <a href="mailto:info@judoclubbrunssum.n">
              info@judoclubbrunssum.nl
            </a>
          </p>
        </hgroup>
      </article>
      <article>
        <hgroup>
          <h6>Sporthal gegevens</h6>
          <p>
            Heugerstraat 2A, 6443 BS Brunssum
            <br />
            {"Telefoon: "}
            <a href="tel:0031455270016">045 - 52 700 16</a>
          </p>
        </hgroup>
      </article>
    </>
  );
}
