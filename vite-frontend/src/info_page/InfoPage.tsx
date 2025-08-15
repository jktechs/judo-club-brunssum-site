import { useQuery } from "@apollo/client";
import { DocumentRenderer } from "@keystone-6/document-renderer";
import { useParams } from "react-router-dom";
import "./InfoPage.css";
import { INFO_PAGE_QUERY } from "../querys";

export default function InfoPage() {
  const { language = "nl", slug = "home" } = useParams();
  const { error, data } = useQuery(INFO_PAGE_QUERY, {
    variables: { language, slug },
  });
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
