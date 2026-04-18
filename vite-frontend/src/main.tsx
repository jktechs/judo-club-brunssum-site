import "./pico.yellow.min.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ApolloClient, InMemoryCache } from "@apollo/client";
import {
  BrowserRouter,
  Navigate,
  Outlet,
  Route,
  Routes,
  useParams,
} from "react-router-dom";
import { API_BASE_PATH } from "../../global.ts";
import { TEXT_MAP } from "./translation.ts";
import { ErrorBoundary } from "react-error-boundary";
import Split from "./Split.tsx";

import App from "./app/App.tsx";
import { ApolloProvider } from "@apollo/client/react";
import { HttpLink } from "@apollo/client";

const HOST = "http://localhost:3000";
const CLIENT = new ApolloClient({
  link: new HttpLink({uri: HOST + API_BASE_PATH + "/graphql"}),
  cache: new InMemoryCache(),
});
// eslint-disable-next-line
const NotFound = () => {
  return (
    <article>{TEXT_MAP["not_found"][useParams().language ?? "nl"]}</article>
  );
};
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ErrorBoundary
      fallbackRender={(e) => (
        <p>error: {e instanceof Error ? e.message : String(e)}</p>
      )}
    >
      <ApolloProvider client={CLIENT}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Navigate to="/nl/info/home" />} />
            <Route path="/:language" element={<App />}>
              <Route index element={<Navigate to="info/home" />} />
              <Route path="info" element={<Outlet />}>
                <Route index element={<Navigate to="home" />} />
                <Route path=":slug?" element={<Split module="InfoPage" />} />
              </Route>
              <Route path="groups" element={<Split module="Groups" />} />
              <Route path="contact" element={<Outlet />}>
                <Route index element={<Split module="Contact" />} />
                <Route path="success" element={<Split module="Success" />} />
              </Route>
              <Route path="agenda/:date?" element={<Split module="Agenda" />} />
              <Route path="downloads" element={<Split module="Downloads" />} />
              <Route path="people" element={<Split module="People" />} />
              <Route path="login" element={<Split module="Login" />} />
              <Route path="account" element={<Split module="Account" />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </ApolloProvider>
    </ErrorBoundary>
  </StrictMode>,
);
