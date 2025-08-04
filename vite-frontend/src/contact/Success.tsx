import { useParams, useSearchParams } from "react-router-dom";
import { capitalize, TEXT_MAP } from "../translation";

function Success() {
  const { language = "nl" } = useParams();
  const error = useSearchParams()[0].get("error");
  if (error === null) {
    return <article>{capitalize(TEXT_MAP["success"][language]) + "."}</article>;
  } else {
    return (
      <article>
        {capitalize(TEXT_MAP["error"][language]) + ": " + error}
      </article>
    );
  }
}

export default Success;
