import {
  BaseListTypeInfo,
  FieldTypeFunc,
  CommonFieldConfig,
  jsonFieldTypePolyfilledForSQLite,
} from "@keystone-6/core/types";
import { graphql } from "@keystone-6/core";
import { JSONValue } from "@keystone-6/core/types";
export function isJSONObject(
  value: JSONValue,
): value is { [key: string]: JSONValue } {
  return !Array.isArray(value) && value !== null && typeof value === "object";
}

export type TranslatedTextFieldConfig<ListTypeInfo extends BaseListTypeInfo> =
  CommonFieldConfig<ListTypeInfo>;

export const translatedText = <ListTypeInfo extends BaseListTypeInfo>({
  ...config
}: TranslatedTextFieldConfig<ListTypeInfo> = {}): FieldTypeFunc<ListTypeInfo> => {
  return (meta) =>
    jsonFieldTypePolyfilledForSQLite(
      meta.provider,
      {
        ...config,
        output: graphql.field({
          type: graphql.JSON,
          args: {
            language: graphql.arg({ type: graphql.String }),
          },
          resolve: ({ value, item }, args, context, info) =>
            isJSONObject(value) && args.language ? value[args.language] : value,
        }),
        input: {
          create: { arg: graphql.arg({ type: graphql.JSON }) },
          update: { arg: graphql.arg({ type: graphql.JSON }) },
        },
        views: "./translatedText/view",
      },
      {},
    );
};
