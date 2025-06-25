import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./app/App.tsx";
import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import {
  BrowserRouter,
  Navigate,
  Outlet,
  Route,
  Routes,
  useParams,
} from "react-router-dom";
import Agenda from "./agenda/Agenda.tsx";
import Groups from "./Groups.tsx";

const CLIENT = new ApolloClient({
  uri: "http://localhost:3000/api/graphql",
  cache: new InMemoryCache(),
});
// eslint-disable-next-line
const HomeRedirect = () => (
  <Navigate to={"/" + useParams().language + "/info/home"} replace />
);
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ApolloProvider client={CLIENT}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/nl" />} />
          <Route path="/:language/" element={<App />}>
            <Route index element={<HomeRedirect />} />
            <Route path="info/:page" element={<></>} />
            <Route path="groups" element={<Groups />} />
            <Route path="agenda" element={<Outlet />}>
              <Route index element={<Agenda />} />
              <Route path=":date" element={<Agenda />} />
            </Route>
            <Route path="downloads" element={<></>} />
            <Route path="downloads/:item" element={<></>} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ApolloProvider>
  </StrictMode>,
);
