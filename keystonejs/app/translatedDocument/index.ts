import { jsonFieldTypePolyfilledForSQLite } from "@keystone-6/core/types";

import {
  BaseListTypeInfo,
  FieldTypeFunc,
  CommonFieldConfig,
} from "@keystone-6/core/types";
import { graphql } from "@keystone-6/core";
import { isJSONObject } from "../global";
import {
  DocumentFeatures,
  controller as documentController,
} from "@keystone-6/fields-document/views";

export const features: DocumentFeatures = {
  formatting: {
    alignment: {
      center: true,
      end: true,
    },
    blockTypes: {
      blockquote: true,
      code: true,
    },
    headingLevels: [1, 2, 3, 4, 5, 6] as const,
    inlineMarks: {
      bold: true,
      code: true,
      italic: true,
      keyboard: true,
      strikethrough: true,
      subscript: true,
      superscript: true,
      underline: true,
    },
    listTypes: {
      ordered: true,
      unordered: true,
    },
    softBreaks: true,
  },
  dividers: true,
  layouts: [[1]],
  links: true,
};

export type TranslatedDocumentFieldConfig<
  ListTypeInfo extends BaseListTypeInfo,
> = CommonFieldConfig<ListTypeInfo> & {};

export const translatedDocument =
  <ListTypeInfo extends BaseListTypeInfo>({
    ...config
  }: TranslatedDocumentFieldConfig<ListTypeInfo> = {}): FieldTypeFunc<ListTypeInfo> =>
  (meta) =>
    jsonFieldTypePolyfilledForSQLite(
      meta.provider,
      {
        ...config,
        output: graphql.field({
          type: graphql.JSON,
          args: {
            language: graphql.arg({ type: graphql.String }),
          },
          resolve: ({ value, item }, args, context, info) => {
            let output =
              isJSONObject(value) && args.language
                ? value[args.language]
                : value;
            if (typeof output === "string") {
              return output;
            } else {
              return value;
            }
          },
        }),
        input: {
          create: { arg: graphql.arg({ type: graphql.JSON }) },
          update: { arg: graphql.arg({ type: graphql.JSON }) },
        },
        views: "./translatedDocument/view",
        getAdminMeta(): Parameters<typeof documentController>[0]["fieldMeta"] {
          return {
            relationships: {},
            documentFeatures: features,
            componentBlocksPassedOnServer: [],
          };
        },
      },
      {},
    );
