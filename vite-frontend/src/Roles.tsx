import { useParams } from "react-router-dom";
import { capitalize } from "./translation";
import { gql, useQuery } from "@apollo/client";
import { DocumentRenderer } from "@keystone-6/document-renderer";

function Roles({ role }: { role: string }) {
  const { language = "nl" } = useParams();
  const { error, data } = useQuery<{
    roles: {
      // eslint-disable-next-line
      discription: any;
      person: {
        name: string;
        picture: {
          url: string;
        } | null;
      };
    }[];
  }>(
    gql`
      query ($language: String, $role: RoleRoleType!) {
        roles(where: { role: { equals: $role } }) {
          discription(language: $language)
          person {
            picture {
              url
            }
            name
          }
        }
      }
    `,
    {
      variables: { language, role },
    },
  );
  if (error !== undefined) {
    console.error(JSON.stringify(error));
  }
  return (
    <>
      <article>
        <h1>{capitalize(role)}</h1>
      </article>
      {data !== undefined ? (
        <>
          {data.roles.map((r) => {
            return (
              <article>
                <h2>{r.person.name}</h2>
                <img src={r.person.picture?.url} />
                <DocumentRenderer document={r.discription} />
              </article>
            );
          })}
        </>
      ) : (
        <article aria-busy="true"></article>
      )}
    </>
  );
}
export default Roles;
