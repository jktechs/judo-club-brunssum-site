import { gql, type TypedDocumentNode } from "@apollo/client";
import type { Role } from "./translation";

export type QueryResult<T> =
  // eslint-disable-next-line
  T extends TypedDocumentNode<infer TResult, any> ? TResult : never;

export const APP_QUERY: TypedDocumentNode<
  {
    menuItems: { label: string; links: { label: string; href: string }[] }[];
    authenticatedItem: {
      id: string;
      name: string;
      email: string;
      admin: boolean;
    } | null;
  },
  { language: string }
> = gql`
  query ($language: String) {
    menuItems(orderBy: { order: asc }) {
      label(language: $language)
      links {
        label(language: $language)
        href
      }
    }
    authenticatedItem {
      ... on User {
        admin
        email
        id
        name
      }
    }
  }
`;
export const AGENDA_QUERY: TypedDocumentNode<
  {
    events: {
      id: string;
      label: string;
      discription: unknown;
      duration: string;
      start: string;
      repeat: "daily" | "weekly" | "never";
      repeat_end: string;
      exception: { id: string }[];
    }[];
  },
  {
    language: string;
    start: string;
    end: string;
  }
> = gql`
  query ($language: String, $start: DateTime, $end: DateTime) {
    events(where: { start: { lt: $end }, repeat_end: { gt: $start } }) {
      id
      label(language: $language)
      discription(language: $language)
      duration
      start
      repeat
      repeat_end
      exception {
        id
      }
    }
  }
`;
export const GROUPS_QUERY: TypedDocumentNode<
  {
    groups: {
      name: string;
      price: string;
      discription: string;
      timeslots: { start: string; duration: string }[];
    }[];
  },
  { language: string }
> = gql`
  query ($language: String) {
    groups {
      name
      price
      discription(language: $language)
      timeslots {
        start
        duration
      }
    }
  }
`;
export const INFO_PAGE_QUERY: TypedDocumentNode<
  {
    // eslint-disable-next-line
    infoPage: { title: string; content: any } | null;
  },
  { language: string; slug: string }
> = gql`
  query ($language: String, $slug: String) {
    infoPage(where: { slug: $slug }) {
      title(language: $language)
      content(language: $language)
    }
  }
`;
export const PERSON_QUERY: TypedDocumentNode<
  {
    person: {
      // eslint-disable-next-line
      discription: any;
      name: string;
      picture: { url: string } | null;
    };
    roles: {
      // eslint-disable-next-line
      discription: any;
      role: Role;
    }[];
  },
  { language: string; name: string }
> = gql`
  query ($name: String!, $language: String!) {
    person(where: { name: $name }) {
      discription(language: $language)
      picture {
        url
      }
      name
    }
    roles(where: { person: { name: { equals: $name } } }) {
      discription(language: $language)
      role
    }
  }
`;
export const PERSON_LIST_QUERY: TypedDocumentNode<
  {
    roles: {
      person: {
        name: string;
        picture: { url: string } | null;
      };
      role: Role;
    }[];
  },
  {
    language: string;
    role: {
      equals?: Role;
    };
  }
> = gql`
  query ($role: RoleRoleTypeNullableFilter) {
    roles(where: { role: $role }) {
      person {
        name
        picture {
          url
        }
      }
      role
    }
  }
`;
export const DOWNLOAD_QUERY: TypedDocumentNode<
  {
    downloads: {
      section: string;
      label: string;
      file: {
        url: string;
      };
    }[];
  },
  {
    language: string;
  }
> = gql`
  query Test($language: String) {
    downloads {
      section
      label(language: $language)
      file {
        url
      }
    }
  }
`;
export const LOGIN_MUTATION: TypedDocumentNode<
  | {
      authenticateUserWithPassword: {
        sessionToken: string;
        item: { admin: boolean; id: string; name: string };
      };
    }
  | { UserAuthenticationWithPasswordFailure: { message: string } },
  { email: string; password: string }
> = gql`
  mutation ($email: String!, $password: String!) {
    authenticateUserWithPassword(email: $email, password: $password) {
      ... on UserAuthenticationWithPasswordSuccess {
        sessionToken
        item {
          admin
          id
          name
        }
      }
      ... on UserAuthenticationWithPasswordFailure {
        message
      }
    }
  }
`;
