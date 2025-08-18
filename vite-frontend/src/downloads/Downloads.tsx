import { useQuery } from "@apollo/client";
import "./Downloads.css";
import { DOWNLOAD_QUERY } from "../queries";
import { useParams } from "react-router-dom";

export default function Downloads() {
  const { language = "nl" } = useParams();
  const { data, error } = useQuery(DOWNLOAD_QUERY, {
    variables: { language },
  });
  if (error !== undefined) {
    console.error(JSON.stringify(error));
  }
  if (data === undefined) {
    return <article aria-busy={true}></article>;
  }
  const map: { [key: string]: { label: string; url: string }[] } = {};
  for (const i of data.downloads) {
    if (map[i.section] === undefined) {
      map[i.section] = [];
    }
    map[i.section].push({ url: i.file.url, label: i.label });
  }
  return (
    <>
      <article>
        <h1>Downloads</h1>
      </article>
      {Object.entries(map).map(([section, items]) => {
        return (
          <article>
            <h2>{section}</h2>
            {items.map((e) => (
              <a href={e.url}>{e.label}</a>
            ))}
          </article>
        );
      })}
    </>
  );
}
