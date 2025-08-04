import { graphql, list } from "@keystone-6/core";

import {
  float,
  text,
  image,
  relationship,
  integer,
  select,
  file,
  password,
  virtual,
  checkbox,
  timestamp,
} from "@keystone-6/core/fields";

import { translatedText } from "./translatedText";
import { translatedDocument } from "./translatedDocument";
import { BaseListTypeInfo, ListAccessControl } from "@keystone-6/core/types";

// import {} from ".keystone/types";

type BaseItem = { id: { toString(): string }; [key: string]: unknown };

type Session = {
  data: {
    id: string;
    admin: boolean;
  };
};
const isAdmin = ({ session }: { session?: Session }) =>
  session !== undefined && session.data.admin;
const protect: ListAccessControl<BaseListTypeInfo> = {
  operation: {
    query: () => true,
    create: isAdmin,
    update: isAdmin,
    delete: isAdmin,
  },
};
const block: ListAccessControl<BaseListTypeInfo> = {
  operation: {
    query: () => true,
    create: isAdmin,
    update: isAdmin,
    delete: isAdmin,
  },
  filter: {
    query: ({ session }) => {
      return isAdmin({ session }) ? {} : { id: { equals: session.itemId } };
    },
  },
};

export const lists = {
  // Users that can edit database entries.
  User: list({
    access: block,
    fields: {
      name: text({ validation: { isRequired: true } }),
      admin: checkbox({ defaultValue: false }),
      email: text({
        validation: { isRequired: true },
        isIndexed: "unique",
      }),
      password: password({}),
    },
  }),
  // Peaple in the organisation.
  Person: list({
    access: protect,
    fields: {
      name: text({
        validation: { isRequired: true },
        isIndexed: "unique",
      }),
      picture: image({
        storage: "local-images",
      }),
      discription: translatedDocument({}),
    },
  }),
  // A role linked to a user. This indicates a person has a cetain role in the organisation.
  Role: list({
    access: protect,
    fields: {
      role: select({
        type: "enum",
        options: [
          { label: "Teacher", value: "teacher" },
          { label: "Board Member", value: "board" },
          { label: "Trusted Counselor", value: "counselor" },
        ],
        validation: { isRequired: true },
        isIndexed: true,
      }),
      person: relationship({ ref: "Person" }),
      discription: translatedDocument({}),
    },
    ui: {
      labelField: "role",
    },
  }),
  // A group that has lessons and dictates the contribution.
  Group: list({
    access: protect,
    fields: {
      name: text({
        validation: { isRequired: true },
        isIndexed: "unique",
      }),
      discription: translatedText({}),
      price: float({
        defaultValue: 0,
        validation: { isRequired: true, min: 0 },
      }),
      timeslots: relationship({
        ref: "Event",
        many: true,
      }),
    },
  }),
  // Static info pages.
  InfoPage: list({
    access: protect,
    fields: {
      slug: text({ validation: { isRequired: true }, isIndexed: "unique" }),
      title: translatedText({}),
      content: translatedDocument({}),
    },
    ui: {
      labelField: "slug",
    },
  }),
  // A menu link.
  Link: list({
    access: protect,
    fields: {
      label: translatedText({}),
      href: text({ validation: { isRequired: true } }),
      label_en: virtual({
        field: graphql.field({
          type: graphql.String,
          async resolve(item: BaseItem, _args, context) {
            const { label } = await context.query.Link.findOne({
              where: { id: item.id.toString() },
              query: 'label(language: "en")',
            });
            return label;
          },
        }),
      }),
    },
    ui: {
      labelField: "label_en",
    },
  }),
  // A menu item that contains one or more links.
  MenuItem: list({
    access: protect,
    fields: {
      label: translatedText({}),
      links: relationship({
        ref: "Link",
        many: true,
      }),
      order: integer({ validation: { isRequired: true } }),
      label_en: virtual({
        field: graphql.field({
          type: graphql.String,
          async resolve(item: BaseItem, _args, context) {
            const { label } = await context.query.MenuItem.findOne({
              where: { id: item.id.toString() },
              query: 'label(language: "en")',
            });
            return label;
          },
        }),
      }),
    },
    ui: {
      labelField: "label_en",
    },
  }),
  // A downloadable item.
  Download: list({
    access: protect,
    fields: {
      label: translatedText({}),
      file: file({
        storage: "local-files",
      }),
      label_en: virtual({
        field: graphql.field({
          type: graphql.String,
          async resolve(item: BaseItem, _args, context) {
            const { label } = await context.query.Download.findOne({
              where: { id: item.id.toString() },
              query: 'label(language: "en")',
            });
            return label;
          },
        }),
      }),
    },
    ui: {
      labelField: "label_en",
    },
  }),
  // An event on the calander.
  Event: list({
    access: protect,
    fields: {
      label: translatedText({}),
      discription: translatedDocument({}),
      start: timestamp({
        validation: { isRequired: true },
        isIndexed: true,
        defaultValue: { kind: "now" },
      }),
      duration: text({
        defaultValue: "00:00",
        validation: {
          isRequired: true,
          match: {
            regex: /^([01]\d|2[0-3]):([0-5]\d)$/,
            explanation: "Time must be in HH:MM 24-hour format",
          },
        },
      }),
      repeat: select({
        validation: { isRequired: true },
        isIndexed: true,
        options: ["daily", "weekly", "never"],
      }),
      repeat_end: timestamp({
        validation: { isRequired: true },
        defaultValue: { kind: "now" },
      }),
      exception: relationship({
        ref: "Event",
        many: true,
      }),
      label_en: virtual({
        field: graphql.field({
          type: graphql.String,
          async resolve(item: BaseItem, _args, context) {
            const { label } = await context.query.Event.findOne({
              where: { id: item.id.toString() },
              query: 'label(language: "en")',
            });
            return label;
          },
        }),
      }),
    },
    ui: {
      labelField: "label_en",
    },
  }),
};
