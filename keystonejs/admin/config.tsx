import { jsx } from "@keystone-ui/core";
import type { AdminConfig } from "@keystone-6/core/types";
import {
  NavigationContainer,
  ListNavItems,
  NavItem,
} from "@keystone-6/core/admin-ui/components";
import type { NavigationProps } from "@keystone-6/core/admin-ui/components";

function CustomLogo() {
  return <h3>Custom Logo here</h3>;
}

// export function CustomNavigation({
//   lists,
//   authenticatedItem,
// }: NavigationProps) {
//   return (
//     <NavigationContainer authenticatedItem={authenticatedItem}>
//       <NavItem href="/rebuild">Rebuild</NavItem>
//       <ListNavItems lists={lists} />
//     </NavigationContainer>
//   );
// }

export const components: AdminConfig["components"] = {
  Logo: CustomLogo,
  // Navigation: CustomNavigation,
};
