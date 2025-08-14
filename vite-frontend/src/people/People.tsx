import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { capitalize, ROLE_NAMES, type Role } from "../translation";
import { gql, useQuery } from "@apollo/client";
import { DocumentRenderer } from "@keystone-6/document-renderer";

function PeopleList({
  language,
  role,
}: {
  language: string;
  role: Role | null;
}) {
  const navigate = useNavigate();
  const { error, data } = useQuery<{
    roles: {
      person: {
        name: string;
        picture: { url: string } | null;
      };
      role: Role;
    }[];
  }>(
    gql`
      query ($role: RoleRoleTypeNullableFilter) {
        roles(where: { role: $role }) {
          person {
            name
            picture {
              url
            }
          }
          role
        }
      }
    `,
    {
      variables: {
        language,
        role:
          role === null
            ? {}
            : {
                equals: role,
              },
      },
    },
  );
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
function Person({ language, name }: { language: string; name: string }) {
  const { error, data } = useQuery<{
    person: {
      // eslint-disable-next-line
      discription: any;
      name: string;
      picture: { url: string } | null;
    };
    roles: {
      // eslint-disable-next-line
      discription: any;
      role: Role;
    }[];
  }>(
    gql`
      query ($name: String!, $language: String!) {
        person(where: { name: $name }) {
          discription(language: $language)
          picture {
            url
          }
          name
        }
        roles(where: { person: { name: { equals: $name } } }) {
          discription(language: $language)
          role
        }
      }
    `,
    { variables: { language, name } },
  );
  if (error !== undefined) {
    console.error(JSON.stringify(error));
  }
  if (data === undefined) {
    return <article aria-busy="true" />;
  }
  return (
    <div className="split">
      <div>
        <article>
          <h1>{data.person.name}</h1>
        </article>
        <article>
          <img
            src={data.person.picture?.url}
            style={{ marginBottom: "var(--pico-block-spacing-vertical)" }}
          />
          <DocumentRenderer document={data.person.discription} />
        </article>
      </div>
      <div style={{ marginLeft: "var(--pico-block-spacing-horizontal)" }}>
        {data.roles.map(({ role, discription }) => (
          <article>
            <h2>{capitalize(ROLE_NAMES[role][0][language])}</h2>
            <DocumentRenderer document={discription} />
          </article>
        ))}
      </div>
    </div>
  );
}

function People() {
  const { language = "nl" } = useParams();
  const [params] = useSearchParams();
  const name = params.get("name");
  if (name !== null) {
    return <Person language={language} name={name} />;
  }
  const role = params.get("role") as Role | null;
  return <PeopleList language={language} role={role} />;

  // const { error, data } = useQuery<{
  //   people: {
  //     // eslint-disable-next-line
  //     discription: any;
  //     name: string;
  //     picture: { url: string } | null;
  //   }[];
  // }>(
  //   gql`
  //     query ($language: String) {
  //       people {
  //         discription(language: $language)
  //         name
  //         picture {
  //           url
  //         }
  //       }
  //     }
  //   `,
  //   { variables: { language } },
  // );
  // if (error !== undefined) {
  //   console.error(JSON.stringify(error));
  // }
  // return (
  //   <>
  //     <article>
  //       <h1>{capitalize(TEXT_MAP["everyone"][language])}</h1>
  //     </article>
  //     {data !== undefined ? (
  //       <>
  //         {data.people.map((p) => {
  //           return (
  //             <article>
  //               <img src={p.picture?.url} />
  //               <h2>{p.name}</h2>
  //               <DocumentRenderer document={p.discription} />
  //             </article>
  //           );
  //         })}
  //       </>
  //     ) : (
  //       <article aria-busy="true"></article>
  //     )}
  //   </>
  // );
}
export default People;
