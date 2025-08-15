import { useParams } from "react-router-dom";
import { capitalize, TEXT_MAP } from "../translation";
import "./Contact.css";

export default function Contact() {
  const { language = "nl" } = useParams();
  return (
    <>
      <article>{"Contact:"}</article>
      <article>
        <form action={"/api/contact"} method="POST">
          <input type="hidden" name="language" value={language} />
          <div style={{ display: "flex" }}>
            <input
              type="text"
              name="name"
              placeholder={capitalize(TEXT_MAP["name"][language])}
              aria-label={capitalize(TEXT_MAP["name"][language])}
              autoComplete="given-name"
              style={{ marginRight: "var(--pico-block-spacing-horizontal)" }}
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              aria-label="Email"
              autoComplete="email"
            />
          </div>
          <textarea
            name="message"
            placeholder={capitalize(TEXT_MAP["message"][language])}
            aria-label={capitalize(TEXT_MAP["message"][language])}
          />
          <div style={{ display: "flex", justifyContent: "end" }}>
            <input
              type="submit"
              value={capitalize(TEXT_MAP["send"][language])}
              style={{ width: "30%" }}
            />
          </div>
        </form>
      </article>
    </>
  );
}
