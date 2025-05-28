import {
  FieldController,
  FieldControllerConfig,
  FieldProps,
} from "@keystone-6/core/types";
import { FieldContainer, FieldLabel, TextInput } from "@keystone-ui/fields";

export const controller = (
  config: FieldControllerConfig,
): FieldController<{ [key: string]: string }> => {
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
  console.log("Field render");
  if (value === null) {
    value = {};
  }
  return (
    <FieldContainer>
      {languages.map((language) => {
        return (
          <FieldContainer key={language.code}>
            <FieldLabel htmlFor={field.path}>
              {field.label}: {language.name}
            </FieldLabel>
            {onChange ? (
              <TextInput
                id={field.path}
                autoFocus={autoFocus}
                type="text"
                onChange={(event) => {
                  onChange({
                    ...(typeof value === "string" ? {} : value),
                    [language.code]: event.target.value,
                  });
                }}
                value={typeof value === "string" ? "" : value[language.code]}
              />
            ) : typeof value === "string" ? (
              ""
            ) : (
              value[language.code]
            )}
          </FieldContainer>
        );
      })}
    </FieldContainer>
  );
};

import { CellLink, CellContainer } from "@keystone-6/core/admin-ui/components";
import { CellComponent } from "@keystone-6/core/types";

export const Cell: CellComponent = ({ item, field, linkTo }) => {
  console.log("Cell render");
  let value = item[field.path];
  if (value === null) {
    value = {};
  }
  let values = Object.values(value).join(", ");
  return linkTo ? (
    <CellLink {...linkTo}>{values}</CellLink>
  ) : (
    <CellContainer>{values}</CellContainer>
  );
};
Cell.supportsLinkTo = true;

import { CardValueComponent } from "@keystone-6/core/types";
import { languages } from "../../global";

export const CardValue: CardValueComponent = ({ item, field }) => {
  console.log("Card render");
  return (
    <FieldContainer>
      <FieldLabel>{field.label}</FieldLabel>
      {JSON.stringify(item[field.path])}
    </FieldContainer>
  );
};
