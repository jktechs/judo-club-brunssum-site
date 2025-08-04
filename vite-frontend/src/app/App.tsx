import { TEXT_MAP, capitalize } from "../translation";
import "./App.css";
import facebook from "./facebook.svg";
import instagram from "./instagram.svg";
import whatsapp from "./whatsapp.svg";
import { gql, useQuery } from "@apollo/client";
import {
  Link,
  Navigate,
  Outlet,
  useLocation,
  useParams,
} from "react-router-dom";
import { languages } from "../../../global";

type MenuItem = { label: string; links: { label: string; href: string }[] };
function App({ content }: { content?: React.ReactNode }) {
  const { language = "nl" } = useParams();
  const location = useLocation();
  const start = location.pathname.substring(1).indexOf("/");
  const path = location.pathname.substring(start + 1);
  const { error, data } = useQuery<{
    menuItems: MenuItem[];
    authenticatedItem: {
      id: string;
      name: string;
      email: string;
      admin: boolean;
    } | null;
  }>(
    gql`
      query ($language: String) {
        menuItems(orderBy: { order: asc }) {
          label(language: $language)
          links {
            label(language: $language)
            href
          }
        }
        authenticatedItem {
          ... on User {
            admin
            email
            id
            name
          }
        }
      }
    `,
    {
      variables: { language },
    },
  );
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
    <>
      <header>
        <div className="container" style={{ alignItems: "center" }}>
          <a href={"/" + language + "/info/home"}>
            <img src="/logo.png" className="logo" />
          </a>
          <nav>
            <ul />
            <ul>
              <li>
                <a href={"/" + language + "/info/home"} className="secondary">
                  Home
                </a>
              </li>
              {data !== undefined ? (
                <NavBar
                  language={language}
                  menuItems={data.menuItems}
                  path={path}
                />
              ) : (
                <article aria-busy="true" />
              )}
            </ul>
          </nav>
          <input id="menu-button" type="checkbox" />
        </div>
      </header>
      <main className="container">
        {content !== undefined ? <>{content}</> : <Outlet />}
      </main>
      <footer className="container">
        <nav>
          <Footer />
        </nav>
      </footer>
    </>
  );
}
type NavBarProps = {
  language: string;
  path: string;
  menuItems: MenuItem[];
};
function NavBar({ language, menuItems, path }: NavBarProps) {
  return (
    <>
      {menuItems.map((item) => {
        if (item.links.length == 1) {
          return (
            <li key={item.label}>
              <a
                role="button"
                href={"/" + language + item.links[0].href}
                className="secondary outline"
                style={{ margin: "0px" }}
              >
                {item.links[0].label}
              </a>
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
                      <a href={"/" + language + link.href}>{link.label}</a>
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
            {capitalize(TEXT_MAP["language"][language])}
          </summary>
          <ul dir="rtl">
            {languages.map((language) => (
              <li key={language.code}>
                <a href={"/" + language.code + path}>{language.name}</a>
              </li>
            ))}
          </ul>
        </details>
      </li>
    </>
  );
}
function Footer() {
  return (
    <>
      <ul>
        <li>
          <article>
            <hgroup>
              <h6>Social media</h6>
              <Link to="https://www.facebook.com/JCBrunssum/">
                <img
                  src={facebook}
                  style={{ width: "4em", padding: "0.5em" }}
                />
              </Link>
              <Link to="https://www.instagram.com/judoclub_brunssum/">
                <img
                  src={instagram}
                  style={{ width: "4em", padding: "0.5em" }}
                />
              </Link>
              <Link to="#">
                <img
                  src={whatsapp}
                  style={{ width: "4em", padding: "0.5em" }}
                />
              </Link>
            </hgroup>
          </article>
        </li>
      </ul>
      <ul>
        <li>
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
        </li>
      </ul>
      <ul>
        <li>
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
        </li>
      </ul>
    </>
  );
}

export default App;
