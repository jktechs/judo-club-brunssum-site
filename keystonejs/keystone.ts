// import express from "express";
import { config } from "@keystone-6/core";
import { sessionSecret } from "./global";

// to keep this file tidy, we define our schema in a different file
import { lists } from "./schema";

import { createAuth } from "@keystone-6/auth";
import { statelessSessions } from "@keystone-6/core/session";

import fs from "fs";
import path from "path";

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
  sessionData: "id name email",
  initFirstItem: {
    fields: ["email", "password"],
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
        generateUrl: (path) => `http://192.168.2.8:3000/images${path}`,
        serverRoute: { path: "/images" },
        storagePath: "public/images",
      },
      "local-files": {
        kind: "local",
        type: "file",
        generateUrl: (path) => `http://192.168.2.8:3000/files${path}`,
        serverRoute: { path: "/files" },
        storagePath: "public/files",
      },
    },
    session,
    ui: {
      basePath: "/admin",
    },
    server: {
      extendExpressApp: (app, context) => {
        app.post("/api/rebuild", (req, res) => {
          const triggerPath = path.join(
            process.cwd(),
            "..",
            "eleventy",
            "trigger.html",
          );
          fs.writeFileSync(
            triggerPath,
            `Triggered at ${new Date().toISOString()}`,
          );
          res.redirect("/");
        });
      },
    },
  }),
);
