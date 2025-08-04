import { gql, useQuery } from "@apollo/client";
import { DocumentRenderer } from "@keystone-6/document-renderer";
import { useParams } from "react-router-dom";

function InfoPage() {
  const { language = "nl", slug = "home" } = useParams();
  const { error, data } = useQuery<{
    // eslint-disable-next-line
    infoPage: { title: string; content: any } | null;
  }>(
    gql`
      query ($language: String, $slug: String) {
        infoPage(where: { slug: $slug }) {
          title(language: $language)
          content(language: $language)
        }
      }
    `,
    { variables: { language, slug } },
  );
  if (error !== undefined) {
    console.error(JSON.stringify(error));
  }
  if (data !== undefined) {
    if (data.infoPage !== null) {
      return (
        <>
          <article>{data.infoPage.title}</article>
          <article>
            <DocumentRenderer document={data.infoPage.content} />
          </article>
        </>
      );
    } else {
      return (
        <article>
          {
            {
              en: "Info page could not be found.",
              nl: "Info pagina kan niet gevonden worden.",
            }[language]
          }
        </article>
      );
    }
  } else {
    return <article aria-busy="true" />;
  }
}
export default InfoPage;
