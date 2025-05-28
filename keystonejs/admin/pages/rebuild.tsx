import { PageContainer } from "@keystone-6/core/admin-ui/components";
import { Heading } from "@keystone-ui/core";

export default function CustomPage() {
  return (
    <PageContainer header={<Heading type="h3">Rebuild</Heading>}>
      <form method="POST" action="/api/rebuild">
        <p>
          <button type="submit">Rebuild pages.</button>
        </p>
      </form>
    </PageContainer>
  );
}
