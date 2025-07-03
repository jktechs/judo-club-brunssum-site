// import express from "express";
import { config, graphql } from "@keystone-6/core";
import { host, sessionSecret } from "../global";

// to keep this file tidy, we define our schema in a different file
import { lists } from "./schema";

import { createAuth } from "@keystone-6/auth";
import { statelessSessions } from "@keystone-6/core/session";

import express from "express";
import fs from "fs";
import path from "path";
import { exec } from "child_process";
import { KeystoneContext } from "@keystone-6/core/types";
import { createTransport } from "nodemailer";
import { MailOptions } from "nodemailer/lib/smtp-transport";

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
  passwordResetLink: {
    sendToken: async ({ itemId, identity, token, context }) => {
      /* ... */
    },
    tokensValidForMins: 60,
  },
  magicAuthLink: {
    sendToken: async ({ itemId, identity, token, context }) => {
      /* ... */
    },
    tokensValidForMins: 60,
  },
});

const EMAIL_CLIENT = createTransport({
  host: "smtp.ethereal.email",
  port: 587,
  auth: {
    user: "lydia.wintheiser@ethereal.email",
    pass: "3ssv7HHRK1EgyzTbCg",
  },
});

export default withAuth(
  config({
    db: {
      // we're using sqlite for the fastest startup experience
      //   for more information on what database might be appropriate for you
      //   see https://keystonejs.com/docs/guides/choosing-a-database#title
      provider: "sqlite",
      url: "file:./keystone.db",
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
        app.post("/api/contact", async (req, res) => {
          let body: {
            language?: string;
            name?: string;
            email?: string;
            message?: string;
          } = req.body;
          if (
            body.language === undefined ||
            body.email === undefined ||
            body.name === undefined ||
            body.message === undefined
          ) {
            return res.status(403).send("Access denied");
          }
          let message: MailOptions = {
            from: {
              name: body.name,
              address: body.email,
            },
            sender: {
              name: "Robot",
              address: "lydia.wintheiser@ethereal.email",
            },
            to: {
              name: "Bart",
              address: "jjlkoppe@hotmail.com",
            },
            subject: "Contact form {" + body.language + "}",
            text: body.message,
            html: "<p>" + body.message + "</p>",
          };
          EMAIL_CLIENT.sendMail(message, (err, info) => {
            return res.redirect("/");
          });
        });
        app.get("*", async (req, res, next) => {
          if (req.path.startsWith("/api")) {
            next();
          } else {
            let requestedPath = req.path === "/" ? "/index.html" : req.path;
            let filePath = path.resolve(
              "../vite-frontend/dist",
              "." + requestedPath,
            );
            if (!filePath.startsWith(path.resolve("../vite-frontend/dist"))) {
              return res.status(403).send("Access denied");
            }
            try {
              let stat = await new Promise<fs.Stats>((res, rej) => {
                fs.stat(filePath, (err, stats) => {
                  if (err !== null) {
                    rej(err);
                  } else {
                    res(stats);
                  }
                });
              });
              if (stat.isFile()) {
                return res.sendFile(filePath);
              }
            } catch (e) {}
            res
              .status(404)
              .sendFile(path.resolve("../vite-frontend/dist/index.html"));
          }
        });
        //   app.post("/api/rebuild", async (req, res) => {
        //     let ctx = await context.withRequest(req, res);
        //     if (ctx.session === undefined) {
        //       res.status(401);
        //       res.send();
        //       return;
        //     }
        //     exec(
        //       "npm i && npx eleventy",
        //       { cwd: "/eleventy" },
        //       (error, stdout, stderr) =>
        //         res.send(
        //           `Error: ${JSON.stringify(error)}<br/>stdout: ${stdout.replaceAll("\n", "<br/>")}<br/>stderr: ${stderr.replaceAll("\n", "<br/>")}`,
        //         ),
        //     );
        //   });
      },
    },
  }),
);
