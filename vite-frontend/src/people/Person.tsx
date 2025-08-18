import { DocumentRenderer } from "@keystone-6/document-renderer";
import { capitalize, ROLE_NAMES } from "../translation";
import { useQuery } from "@apollo/client";
import { PERSON_QUERY } from "../queries";

export default function Person({
  language,
  name,
}: {
  language: string;
  name: string;
}) {
  const { error, data } = useQuery(PERSON_QUERY, {
    variables: { language, name },
  });
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
