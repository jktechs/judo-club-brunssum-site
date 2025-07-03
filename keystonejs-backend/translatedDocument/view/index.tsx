import {
  FieldController,
  FieldControllerConfig,
  FieldProps,
  CellComponent,
  CardValueComponent,
} from "@keystone-6/core/types";
import { CellLink, CellContainer } from "@keystone-6/core/admin-ui/components";
import { FieldContainer, FieldLabel } from "@keystone-ui/fields";
import { Field as DocumentField } from "@keystone-6/fields-document/views";
import { Descendant, Node } from "slate";
import { features } from "..";
import { useMemo } from "react";
import { languages } from "../../../global";

export const controller = (
  config: FieldControllerConfig,
): FieldController<{ [key: string]: Descendant[] }> => {
  return {
    path: config.path,
    label: config.label,
    description: null,
    graphqlSelection: config.path,
    defaultValue: {},
    deserialize: (data) => data[config.path],
    serialize: (value) => ({
      [config.path]: value,
    }),
  };
};

export const Field = ({
  field,
  value,
  onChange,
  autoFocus,
}: FieldProps<typeof controller>) => {
  if (value === null) {
    value = {};
  }
  return languages.map((language) => {
    let memoizedField = useMemo(
      () => ({
        label: field.label + ": " + language.name,
        description: field.description,
        componentBlocks: {},
        relationships: {},
        documentFeatures: features,
      }),
      [field],
    );
    let l_value: Descendant[] = value[language.code];
    if (!l_value) {
      // @ts-expect-error
      l_value = [{ type: "paragraph", children: [{ text: "" }] }];
    }
    return (
      <DocumentField
        key={language.code}
        value={l_value}
        autoFocus={autoFocus}
        onChange={
          onChange
            ? (v) => {
                onChange({ ...value, [language.code]: v });
              }
            : undefined
        }
        // @ts-expect-error
        field={memoizedField}
      ></DocumentField>
    );
  });
};

function serialize(nodes: Node[]) {
  return nodes
    .map((n: Node) => Node.string(n))
    .join("\n")
    .slice(0, 30);
}

export const Cell: CellComponent = ({ item, field, linkTo }) => {
  let value = item[field.path];
  if (value === null) {
    value = {};
  }
  console.dir(value);
  let values = Object.values(value)
    .map((v: any) => serialize(v))
    .join(", ");
  return linkTo ? (
    <CellLink {...linkTo}>{values}</CellLink>
  ) : (
    <CellContainer>{values}</CellContainer>
  );
};
Cell.supportsLinkTo = true;

export const allowedExportsOnCustomViews = ["componentBlocks"];

export const CardValue: CardValueComponent = ({ item, field }) => {
  return (
    <FieldContainer>
      <FieldLabel>{field.label}</FieldLabel>
      {item[field.path]}
    </FieldContainer>
  );
};
