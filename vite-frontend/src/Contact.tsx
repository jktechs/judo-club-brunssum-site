import { useParams } from "react-router-dom";

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
            placeholder="Name"
            aria-label="Name"
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
            placeholder="Write a professional short bio..."
            aria-label="Professional short bio"
          />
          <input type="submit" value={"Send"} />
        </form>
      </article>
    </>
  );
}
export default Contact;
