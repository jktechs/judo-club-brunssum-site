// import express from "express";
import { config, graphql } from "@keystone-6/core";
import { emailPassword, google_secret, host, sessionSecret } from "../global";

// to keep this file tidy, we define our schema in a different file
import { lists } from "./schema";

import { createAuth } from "@keystone-6/auth";
import { statelessSessions } from "@keystone-6/core/session";

import express from "express";
import path from "path";
import { createTransport } from "nodemailer";
import { MailOptions } from "nodemailer/lib/smtp-transport";
import { password } from "@keystone-6/core/fields";

function getClientIP(req: any): string | undefined {
  // x-forwarded-for may be a comma-separated list if multiple proxies
  const forwarded = req.headers["X-Forwarded-For"];
  if (typeof forwarded === "string") {
    return forwarded.split(",")[0].trim();
  } else if (Array.isArray(forwarded)) {
    return forwarded[0].trim();
  }
  // Fallback to direct connection
  return req.socket?.remoteAddress;
}

type GoogleResponse =
  | {
      success: true;
      challenge_ts: string;
      hostname: string;
      score: number;
      action: string;
    }
  | {
      success: false;
      "error-codes": string[];
    };

let sessionMaxAge = 60 * 60 * 24; // 24 hours

const session = statelessSessions({
  maxAge: sessionMaxAge,
  secret: sessionSecret,
});

const { withAuth } = createAuth({
  // Required options
  listKey: "User",
  identityField: "email",
  secretField: "password",

  // Additional options
  sessionData: "id name email admin",
  initFirstItem: {
    fields: ["name", "email", "password", "admin"],
    itemData: {},
    skipKeystoneWelcome: true,
  },
  // passwordResetLink: {
  //   sendToken: async ({ itemId, identity, token, context }) => {
  //     /* ... */
  //   },
  //   tokensValidForMins: 60,
  // },
  // magicAuthLink: {
  //   sendToken: async ({ itemId, identity, token, context }) => {
  //     /* ... */
  //   },
  //   tokensValidForMins: 60,
  // },
});

const EMAIL_CLIENT = createTransport({
  host: "smtp.strato.de",
  port: 465,
  auth: {
    user: "contact@judoclubbrunssum.nl",
    pass: emailPassword,
  },
});

export default withAuth(
  config({
    db: {
      // we're using sqlite for the fastest startup experience
      //   for more information on what database might be appropriate for you
      //   see https://keystonejs.com/docs/guides/choosing-a-database#title
      provider: "sqlite",
      url: "file:./data/keystone.db",
    },
    lists,
    telemetry: false,
    storage: {
      "local-images": {
        kind: "local",
        type: "image",
        generateUrl: (path) => host + `api/images${path}`,
        serverRoute: { path: "/api/images" },
        storagePath: "public/api/images",
      },
      "local-files": {
        kind: "local",
        type: "file",
        generateUrl: (path) => host + `api/files${path}`,
        serverRoute: { path: "/api/files" },
        storagePath: "public/api/files",
      },
    },
    session,
    ui: {
      basePath: "/api",
    },
    graphql: {
      extendGraphqlSchema: graphql.extend((base) => {
        return {
          mutation: {
            // authenticateUserWithPassword: graphql.field({
            //   type: base.union("UserAuthenticationWithPasswordResult"),
            //   args: {
            //     email: graphql.arg({ type: graphql.nonNull(graphql.String) }),
            //     password: graphql.arg({
            //       type: graphql.nonNull(graphql.String),
            //     }),
            //   },
            //   resolve: (source, { email, password }, context) => {},
            // }),
            submitContact: graphql.field({
              type: graphql.Boolean,
              args: {
                name: graphql.arg({ type: graphql.nonNull(graphql.String) }),
                email: graphql.arg({ type: graphql.nonNull(graphql.String) }),
                message: graphql.arg({ type: graphql.nonNull(graphql.String) }),
                token: graphql.arg({ type: graphql.nonNull(graphql.String) }),
                language: graphql.arg({
                  type: graphql.nonNull(graphql.String),
                }),
                week: graphql.arg({
                  type: graphql.nonNull(graphql.String),
                }),
              },
              resolve: async (
                source,
                { name, email, message, token, language, week },
                context,
              ) => {
                let ip = getClientIP(context.req);
                if (week !== "") {
                  throw new Error("Malformed request");
                }
                let resp = await fetch(
                  "https://www.google.com/recaptcha/api/siteverify?secret=" +
                    encodeURIComponent(google_secret) +
                    (ip === undefined
                      ? ""
                      : "&remoteip=" + encodeURIComponent(ip)) +
                    "&response=" +
                    encodeURIComponent(token),
                  {
                    method: "POST",
                  },
                );
                let data = (await resp.json()) as GoogleResponse;
                let success =
                  data.success &&
                  data.score > 0.6 &&
                  host.includes(data.hostname) &&
                  new Date().getTime() - new Date(data.challenge_ts).getTime() <
                    120000;
                if (success) {
                  let options: MailOptions = {
                    from: {
                      name: name + " via contact bot",
                      address: "contact@judoclubbrunssum.nl",
                    },
                    to: {
                      name: "Contact bot",
                      address: "contact@judoclubbrunssum.nl",
                    },
                    replyTo: {
                      name: name,
                      address: email,
                    },
                    headers: {
                      "X-Original-Sender": email,
                      "X-Contact-Form-Name": name,
                    },
                    subject: "Contact form {taal: " + language + "}",
                    text: message,
                    html: message.replace(/\n/g, "<br>"),
                  };
                  await new Promise((res, rej) => {
                    EMAIL_CLIENT.sendMail(options, (err, info) => {
                      if (err != null) {
                        rej(err);
                      }
                      res(info);
                    });
                  });
                }
                return success;
              },
            }),
          },
        };
      }),
    },
    server: {
      cors: {
        origin: [
          "http://localhost:5174",
          "http://localhost:3000",
          "https://portfolio.jannickkoppe.site",
        ],
        credentials: true,
      },
      extendExpressApp: (app, context) => {
        app.use(express.urlencoded({ extended: true }));
        // app.post("/api/contact", async (req, res) => {
        //   let body: {
        //     language?: string;
        //     name?: string;
        //     email?: string;
        //     message?: string;
        //   } = req.body;
        //   if (
        //     body.language === undefined ||
        //     body.email === undefined ||
        //     body.name === undefined ||
        //     body.message === undefined
        //   ) {
        //     return res.status(403).send("Access denied");
        //   }
        //   let message: MailOptions = {
        //     from: {
        //       name: body.name + " via contact bot",
        //       address: "contact@judoclubbrunssum.nl",
        //     },
        //     to: {
        //       name: "Contact bot",
        //       address: "contact@judoclubbrunssum.nl",
        //     },
        //     replyTo: {
        //       name: body.name,
        //       address: body.email,
        //     },
        //     headers: {
        //       "X-Original-Sender": body.email,
        //       "X-Contact-Form-Name": body.name,
        //     },
        //     subject: "Contact form {taal: " + body.language + "}",
        //     text: body.message,
        //     html: body.message.replace(/\n/g, "<br>"),
        //   };
        //   EMAIL_CLIENT.sendMail(message, (err, info) => {
        //     return res.redirect(
        //       "/" + body.language + "/contact/success" + err !== null
        //         ? "?error=" + encodeURIComponent(JSON.stringify(err))
        //         : "",
        //     );
        //   });
        // });
        app.use(express.static("../vite-frontend/dist", { fallthrough: true }));
        app.use((req, res, next) => {
          if (req.path.startsWith("/api")) {
            return next(); // Let the 404 handler handle it
          }
          res.sendFile(
            path.join(__dirname, "../../vite-frontend/dist/index.html"),
          );
        });
      },
    },
  }),
);
