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
import { host } from "../../global.ts";
import People from "./People.tsx";
import { TEXT_MAP } from "./translation.ts";
import Roles from "./Roles.tsx";

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
    <ApolloProvider client={CLIENT}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App content={<InfoPage />} />} />
          <Route path="/:language/" element={<App />}>
            <Route index element={<InfoPage />} />
            <Route path="groups" element={<Groups />} />
            <Route path="contact" element={<Contact />} />
            <Route path="info/:slug?" element={<InfoPage />} />
            <Route path="agenda/:date?" element={<Agenda />} />
            <Route path="downloads/:item" element={<Downloads />} />
            <Route path="people" element={<Outlet />}>
              <Route index element={<People />} />
              <Route path="teacher" element={<Roles role="teacher" />} />
              <Route path="board" element={<Roles role="board" />} />
              <Route path="counselor" element={<Roles role="counselor" />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ApolloProvider>
  </StrictMode>,
);
