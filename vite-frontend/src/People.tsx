import { useParams } from "react-router-dom";
import { capitalize, TEXT_MAP } from "./translation";
import { gql, useQuery } from "@apollo/client";
import { DocumentRenderer } from "@keystone-6/document-renderer";

function People() {
  const { language = "nl" } = useParams();
  const { error, data } = useQuery<{
    people: {
      // eslint-disable-next-line
      discription: any;
      name: string;
      picture: { url: string } | null;
    }[];
  }>(
    gql`
      query ($language: String) {
        people {
          discription(language: $language)
          name
          picture {
            url
          }
        }
      }
    `,
    { variables: { language } },
  );
  if (error !== undefined) {
    console.error(JSON.stringify(error));
  }
  return (
    <>
      <article>
        <h1>{capitalize(TEXT_MAP["everyone"][language])}</h1>
      </article>
      {data !== undefined ? (
        <>
          {data.people.map((p) => {
            return (
              <article>
                <h2>{p.name}</h2>
                <img src={p.picture?.url} />
                <DocumentRenderer document={p.discription} />
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
export default People;
