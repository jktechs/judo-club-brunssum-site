import { list } from "@keystone-6/core";
import { allowAll } from "@keystone-6/core/access";

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
} from "@keystone-6/core/fields";

import { document } from "@keystone-6/fields-document";

// when using Typescript, you can refine your types to a stricter subset by importing
// the generated types from '.keystone/types'
// import { type Lists } from ".keystone/types";

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
function langField(ref: string) {
  let fields = ["content", "language"];
  return relationship({
    ref,
    many: true,
    ui: {
      cardFields: fields,
      displayMode: "cards",
      inlineCreate: { fields },
      inlineEdit: { fields },
      removeMode: 'none',
    },
  });
}
export const lists = {
  User: list({
    access: allowAll,
    fields: {
      name: text({}),
      email: text({
        validation: { isRequired: true },
        isIndexed: "unique",
      }),
      password: password({}),
    },
  }),
  Language: list({
    access: allowAll,
    fields: {
      name: text({
        validation: { isRequired: true },
      }),
      code: text({
        validation: { isRequired: true },
        isIndexed: "unique",
      }),
      language: text({
        validation: { isRequired: true }
      }),
    },
  }),
  ShortText: list({
    access: allowAll,
    fields: {
      content: text({
        validation: { isRequired: true },
      }),
      language: relationship({
        ref: "Language",
      }),
    },
    ui: {
      labelField: "content"
    }
  }),
  LongText: list({
    access: allowAll,
    fields: {
      content: document({
        formatting: true,
        links: true,
      }),
      language: relationship({
        ref: "Language",
      }),
    },
//    ui: {
//      labelField: "content"
//    }
  }),
  Person: list({
    access: allowAll,
    fields: {
      name: text({
        validation: { isRequired: true },
        isIndexed: "unique",
      }),
      picture: image({
        storage: "local-images",
      }),
      discription: langField("LongText"),
    },
  }),
  Role: list({
    access: allowAll,
    fields: {
      discription: langField("LongText"),
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
    }
  }),
  Group: list({
    access: allowAll,
    fields: {
      name: text({
        validation: { isRequired: true },
        isIndexed: "unique",
      }),
      discription: langField("LongText"),
      price: float({
        defaultValue: 0.,
        validation: { isRequired: true, min: 0. },
        precision: 5,
        scale: 2,
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
      //}),
    },
  }),
  InfoPage: list({
    access: allowAll,
    fields: {
      title: langField("ShortText"),
      content: langField("LongText"),
    },
//    ui: {
//      labelField: "title",
//    },
  }),
  MemberCount: list({
    access: allowAll,
    fields: {
      label: langField("ShortText"),
      count: integer({ validation: { isRequired: true } }),
    },
    ui: {
      labelField: "label",
    },
  }),
  Link: list({
    access: allowAll,
    fields: {
      label: langField("ShortText"),
      href: text({ validation: { isRequired: true } }),
    },
    ui: {
      labelField: "label",
    },
  }),
  MenuItem: list({
    access: allowAll,
    fields: {
      label: langField("ShortText"),
      links: relationship({
        ref: "Link",
        many: true,
      }),
      order: integer({ validation: { isRequired: true } }),
    },
    ui: {
      labelField: "label",
    },
  }),
  Download: list({
    access: allowAll,
    fields: {
      label: langField("ShortText"),
      file: file({
        storage: "local-files",
      }),
    },
    ui: {
      labelField: "label",
    },
  }),
}; // satisfies Lists;
