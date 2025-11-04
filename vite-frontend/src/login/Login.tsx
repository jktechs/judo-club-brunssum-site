import "./Login.css";
import { LOGIN_MUTATION } from "../queries";
import { useMutation } from "@apollo/client";
import { Navigate, useParams } from "react-router-dom";
import { LOGIN_ERROR } from "../translation";
export default function Login() {
  const { language = "nl" } = useParams();
  const [login, { data }] = useMutation(LOGIN_MUTATION);
  let message;
  if (data !== undefined && data !== null) {
    console.dir(data);
    if ("message" in data.authenticateUserWithPassword) {
      message = data.authenticateUserWithPassword.message;
    } else {
      return <Navigate to={"/" + language + "/info/home"}></Navigate>;
    }
  }
  async function send(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    login({ variables: { email, password } });
  }
  return (
    <>
      <article>
        <h1>{"Login"}</h1>
      </article>
      <article>
        <form onSubmit={send}>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <input
              type="email"
              name="email"
              placeholder="Email"
              aria-label="Email"
              autoComplete="email"
              style={{ marginRight: "var(--pico-block-spacing-horizontal)" }}
            />
            <input
              type="password"
              name="password"
              placeholder={"password"}
              aria-label={"password"}
              autoComplete="current-password"
            />
            {message !== undefined ? <p>{LOGIN_ERROR[language]}</p> : <></>}
          </div>
          <div style={{ display: "flex", justifyContent: "end" }}>
            <input type="submit" value={"login"} style={{ width: "30%" }} />
          </div>
        </form>
      </article>
    </>
  );
}
