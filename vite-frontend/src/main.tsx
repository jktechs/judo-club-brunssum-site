import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import {
  BrowserRouter,
  Navigate,
  Outlet,
  Route,
  Routes,
  useParams,
} from "react-router-dom";
import { host } from "../../global.ts";
import { TEXT_MAP } from "./translation.ts";
import { ErrorBoundary } from "react-error-boundary";
import Split from "./Split.tsx";

import App from "./app/App.tsx";
// import Agenda from "./agenda/Agenda.tsx";
// import Groups from "./groups/Groups.tsx";
// import InfoPage from "./info_page/InfoPage.tsx";
// import Contact from "./contact/Contact.tsx";
// import Downloads from "./downloads/Downloads.tsx";
// import People from "./people/People.tsx";
// import Success from "./contact/Success.tsx";

const CLIENT = new ApolloClient({
  uri: host + "api/graphql",
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
    <ErrorBoundary fallbackRender={(e) => <p>error: {e.error.toString()}</p>}>
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
