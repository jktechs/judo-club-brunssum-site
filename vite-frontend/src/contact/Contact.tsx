import { useParams } from "react-router-dom";
import { capitalize, TEXT_MAP } from "../translation";
import "./Contact.css";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { useMutation } from "@apollo/client";
import { CONTACT_MUTATION } from "../queries";
import type React from "react";
import Success from "./Success";

export default function Contact() {
  const { language = "nl" } = useParams();
  const { executeRecaptcha } = useGoogleReCaptcha();
  const [contact, { data }] = useMutation(CONTACT_MUTATION);
  if (data) {
    return <Success />;
  }
  async function send(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (executeRecaptcha === undefined) {
      return;
    }
    const formData = new FormData(event.currentTarget);
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const week = formData.get("week") as string;
    const message = formData.get("message") as string;
    const language = formData.get("language") as string;
    const token = await executeRecaptcha();
    contact({ variables: { email, language, message, name, week, token } });
  }

  // // eslint-disable-next-line
  // (window as Record<string, any>)["execute"] = executeRecaptcha;
  // // eslint-disable-next-line
  // (window as Record<string, any>)["contact"] = contact;
  return (
    <>
      <article>
        <h1>{"Contact"}</h1>
      </article>
      <article>
        <form onSubmit={send}>
          <input type="hidden" name="language" value={language} />
          <input
            type="week"
            name="week"
            tabIndex={-1}
            autoComplete="off"
            style={{
              position: "absolute",
              left: "-100%",
              top: "auto",
              width: "1px",
              height: "1px",
              overflow: "hidden",
            }}
            aria-hidden="true"
          />
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
          <textarea
            name="message"
            placeholder={capitalize(TEXT_MAP["message"][language])}
            aria-label={capitalize(TEXT_MAP["message"][language])}
          />
          <div style={{ display: "flex", justifyContent: "end" }}>
            <input
              // disabled
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
