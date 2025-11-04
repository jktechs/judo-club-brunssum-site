import { gql, useQuery } from "@apollo/client";
const ACCOUNT_QUERY = gql`
  query Query {
    authenticatedItem {
      ... on User {
        email
        name
        id
      }
    }
  }
`;
function Account() {
  const { error, data } = useQuery<{
    authenticatedItem: { email: string; name: string; id: string };
  }>(ACCOUNT_QUERY);
  if (error !== undefined) {
    console.error(JSON.stringify(error));
  }
  if (data !== undefined) {
    return (
      <>
        <p>{data.authenticatedItem.name}</p>
        <p>{data.authenticatedItem.email}</p>
        <p>{data.authenticatedItem.id}</p>
      </>
    );
  }
  return <></>;
}
export default Account;
