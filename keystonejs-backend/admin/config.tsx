// import { jsx } from "@keystone-ui/core";
import type { AdminConfig } from "@keystone-6/core/types";

function CustomLogo() {
  return (
    <img
      src="/logo.png"
      style={{
        width: "4em",
        filter: "brightness(0)",
      }}
      className="logo"
      alt="JCB Logo"
    />
  );
}

export const components: AdminConfig["components"] = {
  Logo: CustomLogo,
};
