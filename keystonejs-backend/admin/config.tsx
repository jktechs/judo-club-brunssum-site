// import { jsx } from "@keystone-ui/core";
import type { AdminConfig } from "@keystone-6/core/types";

function CustomLogo() {
  return (
    <img
      src="/logo.png"
      style={{
        width: "4em",
        height: "calc(4em * 1.25779376)",
        filter: "brightness(0)",
      }}
      className="logo"
    />
  );
}

export const components: AdminConfig["components"] = {
  Logo: CustomLogo,
};
