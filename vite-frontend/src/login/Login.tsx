import "./Login.css";
export default function Login() {
  return (
    <>
      <article>{"Login:"}</article>
      <article>
        <form
          onSubmit={(e) => {
            console.dir(e);
          }}
        >
          <div style={{ display: "flex" }}>
            <input
              type="email"
              name="email"
              placeholder="Email"
              aria-label="Email"
              autoComplete="email"
              style={{ marginRight: "var(--pico-block-spacing-horizontal)" }}
            />
            <input
              type="text"
              name="name"
              placeholder={"password"}
              aria-label={"password"}
              autoComplete="current-password"
            />
          </div>
          <div style={{ display: "flex", justifyContent: "end" }}>
            <input type="submit" value={"login"} style={{ width: "30%" }} />
          </div>
        </form>
      </article>
    </>
  );
}
