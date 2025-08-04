import { useParams } from "react-router-dom";
import { capitalize, TEXT_MAP } from "../translation";

function Contact() {
  const { language = "nl" } = useParams();
  return (
    <>
      <article>{"Contact:"}</article>
      <article>
        <form action={"/api/contact"} method="POST">
          <input type="hidden" name="language" value={language} />
          <input
            type="text"
            name="name"
            placeholder={capitalize(TEXT_MAP["name"][language])}
            aria-label={capitalize(TEXT_MAP["name"][language])}
            autoComplete="given-name"
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            aria-label="Email"
            autoComplete="email"
          />
          <textarea
            name="message"
            placeholder={capitalize(TEXT_MAP["message"][language])}
            aria-label={capitalize(TEXT_MAP["message"][language])}
          />
          <input type="submit" value={capitalize(TEXT_MAP["send"][language])} />
        </form>
      </article>
    </>
  );
}
export default Contact;
