// import express from "express";
import { config, graphql } from "@keystone-6/core";
import { sessionSecret } from "./global";

// to keep this file tidy, we define our schema in a different file
import { lists } from "./schema";

import { createAuth } from "@keystone-6/auth";
import { statelessSessions } from "@keystone-6/core/session";

import fs from "fs";
import path from "path";
import { exec } from "child_process";
import { KeystoneContext } from "@keystone-6/core/types";

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
        generateUrl: (path) =>
          `https://portfolio.jannickkoppe.site/api/images${path}`,
        serverRoute: { path: "/api/images" },
        storagePath: "public/api/images",
      },
      "local-files": {
        kind: "local",
        type: "file",
        generateUrl: (path) =>
          `https://portfolio.jannickkoppe.site/api/files${path}`,
        serverRoute: { path: "/api/files" },
        storagePath: "public/api/files",
      },
    },
    // graphql: {
    //   extendGraphqlSchema: graphql.extend((base) => {
    //     return {
    //       query: {
    //         eventsByYear: graphql.field({
    //           type: graphql.list(graphql.nonNull(base.object("Event"))),
    //           args: {
    //             year: graphql.arg({ type: graphql.nonNull(graphql.Int) }),
    //           },
    //           resolve: (source, { year }, context: KeystoneContext<any>) => {
    //             return context.db.Event.findMany({where: {}});
    //           },
    //         }),
    //       },
    //     };
    //   }),
    // },
    session,
    ui: {
      basePath: "/api",
    },
    server: {
      cors: {
        origin: ["http://localhost:5174", "http://localhost:3000"],
        credentials: true,
      },
      // extendExpressApp: (app, context) => {
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
      // },
    },
  }),
);
