import { graphql, list } from "@keystone-6/core";
import { allowAll } from "@keystone-6/core/access";
type BaseItem = { id: { toString(): string }; [key: string]: unknown };

// see https://keystonejs.com/docs/fields/overview for the full list of fields
//   this is a few common fields for an example
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
} from "@keystone-6/core/fields";

import { translatedText } from "./translatedText";
import { translatedDocument } from "./translatedDocument";

// when using Typescript, you can refine your types to a stricter subset by importing
// the generated types from '.keystone/types'
// import { type Lists } from ".keystone/types";

type Session = {
  data: {
    id: string;
  };
};
const isAdmin = ({ session }: { session?: Session }) => session !== undefined;
const protect = {
  operation: {
    query: () => true,
    create: isAdmin,
    update: isAdmin,
    delete: isAdmin,
  },
};

function timeField() {
  return text({
    validation: {
      isRequired: true,
      match: {
        regex: /^([01]\d|2[0-3]):([0-5]\d)$/,
        explanation: "Time must be in HH:MM 24-hour format",
      },
    },
  });
}
export const lists = {
  User: list({
    access: protect,
    fields: {
      name: text({}),
      email: text({
        validation: { isRequired: true },
        isIndexed: "unique",
      }),
      password: password({}),
    },
  }),
  // Language: list({
  //   access: allowAll,
  //   fields: {
  //     name: text({
  //       validation: { isRequired: true },
  //     }),
  //     code: text({
  //       validation: { isRequired: true },
  //       isIndexed: "unique",
  //     }),
  //     language: text({
  //       validation: { isRequired: true },
  //     }),
  //   },
  // }),
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
  Role: list({
    access: protect,
    fields: {
      discription: translatedDocument({}),
      role: select({
        type: "enum",
        options: [
          { label: "Teacher", value: "teacher" },
          { label: "BoardMember", value: "board" },
          { label: "TrustedCounselor", value: "counselor" },
        ],
      }),
      person: relationship({ ref: "Person" }),
    },
    ui: {
      labelField: "role",
    },
  }),
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
        // precision: 5,
        // scale: 2,
      }),
      start_monday: timeField(),
      end_monday: timeField(),
      start_saturday: timeField(),
      end_saturday: timeField(),
      //author: relationship({
      //  ref: 'User.posts',
      //  ui: {
      //    displayMode: 'cards',
      //    cardFields: ['name', 'email'],
      //    inlineEdit: { fields: ['name', 'email'] },
      //    linkToItem: true,
      //    inlineConnect: true,
      //  },
      //  many: false,
      // }),
    },
  }),
  InfoPage: list({
    access: protect,
    fields: {
      title: translatedText({}),
      content: translatedDocument({}),
      title_en: virtual({
        field: graphql.field({
          type: graphql.String,
          async resolve(item: BaseItem, args, context) {
            const { title } = await context.query.InfoPage.findOne({
              where: { id: item.id.toString() },
              query: 'title(language: "en")',
            });
            return title;
          },
        }),
      }),
    },
    ui: {
      labelField: "title_en",
    },
  }),
  MemberCount: list({
    access: protect,
    fields: {
      label: translatedText({}),
      count: integer({ validation: { isRequired: true } }),
      label_en: virtual({
        field: graphql.field({
          type: graphql.String,
          async resolve(item: BaseItem, args, context) {
            const { label } = await context.query.MemberCount.findOne({
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
  Link: list({
    access: protect,
    fields: {
      label: translatedText({}),
      href: text({ validation: { isRequired: true } }),
      label_en: virtual({
        field: graphql.field({
          type: graphql.String,
          async resolve(item: BaseItem, args, context) {
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
          async resolve(item: BaseItem, args, context) {
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
          async resolve(item: BaseItem, args, context) {
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
}; // satisfies Lists;
