import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./app/App.tsx";
import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import {
  BrowserRouter,
  Outlet,
  Route,
  Routes,
  useParams,
} from "react-router-dom";
import Agenda from "./agenda/Agenda.tsx";
import Groups from "./Groups.tsx";
import InfoPage from "./InfoPage.tsx";
import Contact from "./Contact.tsx";
import Downloads from "./Downloads.tsx";

const CLIENT = new ApolloClient({
  uri: "http://localhost:3000/api/graphql",
  cache: new InMemoryCache(),
});
// eslint-disable-next-line
const NotFound = () => (
  <article>
    {
      {
        en: "Page could not be found.",
        nl: "Pagina kan niet gevonden worden.",
      }[useParams().language ?? "nl"]
    }
  </article>
);
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ApolloProvider client={CLIENT}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App content={<InfoPage />} />} />
          <Route path="/:language/" element={<App />}>
            <Route index element={<InfoPage />} />
            <Route path="groups" element={<Groups />} />
            <Route path="contact" element={<Contact />} />
            <Route path="info/" element={<Outlet />}>
              <Route index element={<InfoPage />} />
              <Route path=":slug" element={<InfoPage />} />
            </Route>
            <Route path="agenda" element={<Outlet />}>
              <Route index element={<Agenda />} />
              <Route path=":date" element={<Agenda />} />
            </Route>
            <Route path="downloads/:item" element={<Downloads />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ApolloProvider>
  </StrictMode>,
);
