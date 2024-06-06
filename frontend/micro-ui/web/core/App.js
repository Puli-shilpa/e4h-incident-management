import React from "react";
import { initLibraries } from "@egovernments/digit-ui-libraries";
import { DigitUI } from "@egovernments/digit-ui-module-core";
import { UICustomizations } from "./Customisations/UICustomizations";
import { initWorkbenchComponents } from "@egovernments/digit-ui-module-workbench";
import { initUtilitiesComponents } from "@egovernments/digit-ui-module-utilities";
import { initIMComponents,IMReducers } from "@egovernments/digit-ui-module-pgr";

window.contextPath = "digit-ui" || window?.globalConfigs?.getConfig("CONTEXT_PATH")

const enabledModules = [
  "DSS",
  "NDSS",
  "Utilities",
  "Engagement",
  "Workbench",
  "IM"
];

const moduleReducers = (initData) => ({
  initData, pgr: IMReducers(initData),
});

const initDigitUI = () => {
  window.Digit.ComponentRegistryService.setupRegistry({});
  window.Digit.Customizations = {
    PGR: {},
    commonUiConfig: UICustomizations,
  };
  initUtilitiesComponents();
  initWorkbenchComponents();
  initIMComponents();
};

initLibraries().then(() => {
  initDigitUI();
});

function App() {
  window.contextPath = "digit-ui" || window?.globalConfigs?.getConfig("CONTEXT_PATH") || "http://localhost:3003/digit-ui"
  console.log("CONTEXT_PATH", window?.globalConfigs?.getConfig("CONTEXT_PATH"))
  const stateCode =
    window.globalConfigs?.getConfig("STATE_LEVEL_TENANT_ID") ||
    process.env.REACT_APP_STATE_LEVEL_TENANT_ID;
  if (!stateCode) {
    return <h1>stateCode is not defined</h1>;
  }
  return (
    <DigitUI
      stateCode={stateCode}
      enabledModules={enabledModules}
      moduleReducers={moduleReducers}
      defaultLanding="employee"
    />
  );
}

export default App;
