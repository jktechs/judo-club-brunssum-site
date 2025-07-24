"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// keystone.ts
var keystone_exports = {};
__export(keystone_exports, {
  default: () => keystone_default
});
module.exports = __toCommonJS(keystone_exports);
var import_core4 = require("@keystone-6/core");

// ../global.ts
var sessionSecret = "2Ay2SxZMT+Uy22Ay2SxZMT+Uy22Ay2SxZMT+Uy2";
var host = "http://localhost:3000/";

// schema.ts
var import_core3 = require("@keystone-6/core");
var import_fields = require("@keystone-6/core/fields");

// translatedText/index.ts
var import_types = require("@keystone-6/core/types");
var import_core = require("@keystone-6/core");
function isJSONObject(value) {
  return !Array.isArray(value) && value !== null && typeof value === "object";
}
var translatedText = ({
  ...config2
} = {}) => {
  return (meta) => (0, import_types.jsonFieldTypePolyfilledForSQLite)(
    meta.provider,
    {
      ...config2,
      output: import_core.graphql.field({
        type: import_core.graphql.JSON,
        args: {
          language: import_core.graphql.arg({ type: import_core.graphql.String })
        },
        resolve: ({ value, item }, args, context, info) => isJSONObject(value) && args.language ? value[args.language] : value
      }),
      input: {
        create: { arg: import_core.graphql.arg({ type: import_core.graphql.JSON }) },
        update: { arg: import_core.graphql.arg({ type: import_core.graphql.JSON }) }
      },
      views: "./translatedText/view"
    },
    {}
  );
};

// translatedDocument/index.ts
var import_types2 = require("@keystone-6/core/types");
var import_core2 = require("@keystone-6/core");
var features = {
  formatting: {
    alignment: {
      center: true,
      end: true
    },
    blockTypes: {
      blockquote: true,
      code: true
    },
    headingLevels: [1, 2, 3, 4, 5, 6],
    inlineMarks: {
      bold: true,
      code: true,
      italic: true,
      keyboard: true,
      strikethrough: true,
      subscript: true,
      superscript: true,
      underline: true
    },
    listTypes: {
      ordered: true,
      unordered: true
    },
    softBreaks: true
  },
  dividers: true,
  layouts: [[1], [1, 1], [2, 1]],
  links: true
};
var translatedDocument = ({
  ...config2
} = {}) => (meta) => (0, import_types2.jsonFieldTypePolyfilledForSQLite)(
  meta.provider,
  {
    ...config2,
    output: import_core2.graphql.field({
      type: import_core2.graphql.JSON,
      args: {
        language: import_core2.graphql.arg({ type: import_core2.graphql.String })
      },
      resolve: ({ value, item }, args, context, info) => isJSONObject(value) && args.language ? value[args.language] : value
    }),
    input: {
      create: { arg: import_core2.graphql.arg({ type: import_core2.graphql.JSON }) },
      update: { arg: import_core2.graphql.arg({ type: import_core2.graphql.JSON }) }
    },
    views: "./translatedDocument/view",
    getAdminMeta() {
      return {
        relationships: {},
        documentFeatures: features,
        componentBlocksPassedOnServer: []
      };
    }
  },
  {}
);

// schema.ts
var isAdmin = ({ session: session2 }) => session2 !== void 0 && session2.data.admin;
var protect = {
  operation: {
    query: () => true,
    create: isAdmin,
    update: isAdmin,
    delete: isAdmin
  }
};
var block = {
  operation: {
    query: () => true,
    create: isAdmin,
    update: isAdmin,
    delete: isAdmin
  },
  filter: {
    query: ({ session: session2, context, listKey, operation }) => {
      return isAdmin({ session: session2 }) ? {} : { id: { equals: session2.itemId } };
    }
  }
};
var lists = {
  // Users that can edit database entries.
  User: (0, import_core3.list)({
    access: block,
    fields: {
      name: (0, import_fields.text)({ validation: { isRequired: true } }),
      admin: (0, import_fields.checkbox)({ defaultValue: false }),
      email: (0, import_fields.text)({
        validation: { isRequired: true },
        isIndexed: "unique"
      }),
      password: (0, import_fields.password)({})
    }
  }),
  // Peaple in the organisation.
  Person: (0, import_core3.list)({
    access: protect,
    fields: {
      name: (0, import_fields.text)({
        validation: { isRequired: true },
        isIndexed: "unique"
      }),
      picture: (0, import_fields.image)({
        storage: "local-images"
      }),
      discription: translatedDocument({})
    }
  }),
  // A role linked to a user. This indicates a person has a cetain role in the organisation.
  Role: (0, import_core3.list)({
    access: protect,
    fields: {
      role: (0, import_fields.select)({
        type: "enum",
        options: [
          { label: "Teacher", value: "teacher" },
          { label: "Board Member", value: "board" },
          { label: "Trusted Counselor", value: "counselor" }
        ],
        validation: { isRequired: true },
        isIndexed: true
      }),
      person: (0, import_fields.relationship)({ ref: "Person" }),
      discription: translatedDocument({})
    },
    ui: {
      labelField: "role"
    }
  }),
  // A group that has lessons and dictates the contribution.
  Group: (0, import_core3.list)({
    access: protect,
    fields: {
      name: (0, import_fields.text)({
        validation: { isRequired: true },
        isIndexed: "unique"
      }),
      discription: translatedText({}),
      price: (0, import_fields.float)({
        defaultValue: 0,
        validation: { isRequired: true, min: 0 }
      }),
      timeslots: (0, import_fields.relationship)({
        ref: "Event",
        many: true
      })
    }
  }),
  // Static info pages.
  InfoPage: (0, import_core3.list)({
    access: protect,
    fields: {
      slug: (0, import_fields.text)({ validation: { isRequired: true }, isIndexed: "unique" }),
      title: translatedText({}),
      content: translatedDocument({})
    },
    ui: {
      labelField: "slug"
    }
  }),
  // A menu link.
  Link: (0, import_core3.list)({
    access: protect,
    fields: {
      label: translatedText({}),
      href: (0, import_fields.text)({ validation: { isRequired: true } }),
      label_en: (0, import_fields.virtual)({
        field: import_core3.graphql.field({
          type: import_core3.graphql.String,
          async resolve(item, args, context) {
            const { label } = await context.query.Link.findOne({
              where: { id: item.id.toString() },
              query: 'label(language: "en")'
            });
            return label;
          }
        })
      })
    },
    ui: {
      labelField: "label_en"
    }
  }),
  // A menu item that contains one or more links.
  MenuItem: (0, import_core3.list)({
    access: protect,
    fields: {
      label: translatedText({}),
      links: (0, import_fields.relationship)({
        ref: "Link",
        many: true
      }),
      order: (0, import_fields.integer)({ validation: { isRequired: true } }),
      label_en: (0, import_fields.virtual)({
        field: import_core3.graphql.field({
          type: import_core3.graphql.String,
          async resolve(item, args, context) {
            const { label } = await context.query.MenuItem.findOne({
              where: { id: item.id.toString() },
              query: 'label(language: "en")'
            });
            return label;
          }
        })
      })
    },
    ui: {
      labelField: "label_en"
    }
  }),
  // A downloadable item.
  Download: (0, import_core3.list)({
    access: protect,
    fields: {
      label: translatedText({}),
      file: (0, import_fields.file)({
        storage: "local-files"
      }),
      label_en: (0, import_fields.virtual)({
        field: import_core3.graphql.field({
          type: import_core3.graphql.String,
          async resolve(item, args, context) {
            const { label } = await context.query.Download.findOne({
              where: { id: item.id.toString() },
              query: 'label(language: "en")'
            });
            return label;
          }
        })
      })
    },
    ui: {
      labelField: "label_en"
    }
  }),
  // An event on the calander.
  Event: (0, import_core3.list)({
    access: protect,
    fields: {
      label: translatedText({}),
      discription: translatedDocument({}),
      start: (0, import_fields.timestamp)({
        validation: { isRequired: true },
        isIndexed: true,
        defaultValue: { kind: "now" }
      }),
      duration: (0, import_fields.text)({
        defaultValue: "00:00",
        validation: {
          isRequired: true,
          match: {
            regex: /^([01]\d|2[0-3]):([0-5]\d)$/,
            explanation: "Time must be in HH:MM 24-hour format"
          }
        }
      }),
      repeat: (0, import_fields.select)({
        validation: { isRequired: true },
        isIndexed: true,
        options: ["daily", "weekly", "never"]
      }),
      repeat_end: (0, import_fields.timestamp)({
        validation: { isRequired: true },
        defaultValue: { kind: "now" }
      }),
      exception: (0, import_fields.relationship)({
        ref: "Event",
        many: true
      }),
      label_en: (0, import_fields.virtual)({
        field: import_core3.graphql.field({
          type: import_core3.graphql.String,
          async resolve(item, args, context) {
            const { label } = await context.query.Event.findOne({
              where: { id: item.id.toString() },
              query: 'label(language: "en")'
            });
            return label;
          }
        })
      })
    },
    ui: {
      labelField: "label_en"
    }
  })
};

// keystone.ts
var import_auth = require("@keystone-6/auth");
var import_session = require("@keystone-6/core/session");
var import_express = __toESM(require("express"));
var import_path = __toESM(require("path"));
var import_nodemailer = require("nodemailer");
var sessionMaxAge = 60 * 60 * 24;
var session = (0, import_session.statelessSessions)({
  maxAge: sessionMaxAge,
  secret: sessionSecret
});
var { withAuth } = (0, import_auth.createAuth)({
  // Required options
  listKey: "User",
  identityField: "email",
  secretField: "password",
  // Additional options
  sessionData: "id name email admin",
  initFirstItem: {
    fields: ["name", "email", "password", "admin"],
    itemData: {},
    skipKeystoneWelcome: true
  },
  passwordResetLink: {
    sendToken: async ({ itemId, identity, token, context }) => {
    },
    tokensValidForMins: 60
  },
  magicAuthLink: {
    sendToken: async ({ itemId, identity, token, context }) => {
    },
    tokensValidForMins: 60
  }
});
var EMAIL_CLIENT = (0, import_nodemailer.createTransport)({
  host: "smtp.ethereal.email",
  port: 587,
  auth: {
    user: "lydia.wintheiser@ethereal.email",
    pass: "3ssv7HHRK1EgyzTbCg"
  }
});
var keystone_default = withAuth(
  (0, import_core4.config)({
    db: {
      // we're using sqlite for the fastest startup experience
      //   for more information on what database might be appropriate for you
      //   see https://keystonejs.com/docs/guides/choosing-a-database#title
      provider: "sqlite",
      url: "file:./keystone.db"
    },
    lists,
    telemetry: false,
    storage: {
      "local-images": {
        kind: "local",
        type: "image",
        generateUrl: (path2) => host + `api/images${path2}`,
        serverRoute: { path: "/api/images" },
        storagePath: "public/api/images"
      },
      "local-files": {
        kind: "local",
        type: "file",
        generateUrl: (path2) => host + `api/files${path2}`,
        serverRoute: { path: "/api/files" },
        storagePath: "public/api/files"
      }
    },
    session,
    ui: {
      basePath: "/api"
    },
    server: {
      cors: {
        origin: [
          "http://localhost:5174",
          "http://localhost:3000",
          "https://portfolio.jannickkoppe.site"
        ],
        credentials: true
      },
      extendExpressApp: (app, context) => {
        app.use(import_express.default.urlencoded({ extended: true }));
        app.post("/api/contact", async (req, res) => {
          let body = req.body;
          if (body.language === void 0 || body.email === void 0 || body.name === void 0 || body.message === void 0) {
            return res.status(403).send("Access denied");
          }
          let message = {
            from: {
              name: body.name,
              address: body.email
            },
            sender: {
              name: "Robot",
              address: "lydia.wintheiser@ethereal.email"
            },
            to: {
              name: "Bart",
              address: "jjlkoppe@hotmail.com"
            },
            subject: "Contact form {" + body.language + "}",
            text: body.message,
            html: "<p>" + body.message + "</p>"
          };
          EMAIL_CLIENT.sendMail(message, (err, info) => {
            return res.redirect("/");
          });
        });
        app.use(import_express.default.static("../vite-frontend/dist", { fallthrough: true }));
        app.use((req, res, next) => {
          if (req.path.startsWith("/api")) {
            return next();
          }
          res.sendFile(
            import_path.default.join(__dirname, "../../vite-frontend/dist/index.html")
          );
        });
      }
    }
  })
);
//# sourceMappingURL=config.js.map
