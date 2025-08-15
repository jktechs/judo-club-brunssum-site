import { useParams, useSearchParams } from "react-router-dom";
import { type Role } from "../translation";
import "./Peaple.css";
import PersonList from "./PersonList";
import Person from "./Person";

export default function People() {
  const { language = "nl" } = useParams();
  const [params] = useSearchParams();
  const name = params.get("name");
  if (name !== null) {
    return <Person language={language} name={name} />;
  }
  const role = params.get("role") as Role | null;
  return <PersonList language={language} role={role} />;
}
