import { useQuery } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import { capitalize, ROLE_NAMES, type Role } from "../translation";
import { PERSON_LIST_QUERY } from "../querys";

export default function PersonList({
  language,
  role,
}: {
  language: string;
  role: Role | null;
}) {
  const navigate = useNavigate();
  const { error, data } = useQuery(PERSON_LIST_QUERY, {
    variables: {
      language,
      role:
        role === null
          ? {}
          : {
              equals: role,
            },
    },
  });
  if (error !== undefined) {
    console.error(JSON.stringify(error));
  }
  const deduplicated = Array.from(
    new Map((data?.roles ?? []).map((e) => [e.person.name, e])).values(),
  );
  return (
    <>
      <article>
        <h1>{capitalize(ROLE_NAMES[role ?? ""][1][language])}</h1>
      </article>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-around",
        }}
      >
        {deduplicated.map(({ person, role: c_role }) => {
          return (
            <article
              style={{ height: "fit-content", cursor: "pointer" }}
              onClick={() =>
                navigate(
                  "/" + language + "/people?name=" + encodeURI(person.name),
                )
              }
            >
              {role === null ? capitalize(ROLE_NAMES[c_role][0][language]) : ""}
              <br />
              <img src={person.picture?.url} />
              <h2>{person.name}</h2>
            </article>
          );
        })}
      </div>
    </>
  );
}
