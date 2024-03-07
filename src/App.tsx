import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import { Theme } from "@twilio-paste/theme";
import Header from "./components/Header";
import CheckCardContainer from "./components/CheckCardContainer";
import { Check } from "./checks/Check";
import UsageTriggersCheck from "./checks/UsageTriggersCheck";
import UnusedNumbersCheck from "./checks/UnusedNumbersCheck";
import FallbackCheck from "./checks/FallbackCheck";
import ApiKeysCheck from "./checks/ApiKeysCheck";
import FlexVoiceSDKCheck from "./checks/FlexVoiceSDKCheck";
import FlexPluginLimitCheck from "./checks/FlexPluginLimitCheck";
import SingleWorkflowCheck from "./checks/SingleWorkflowCheck";
import StuckExecutionsCheck from "./checks/StuckExecutionsCheck";
import SubflowsCheck from "./checks/SubflowsCheck";
import ExternalFailureCheck from "./checks/ExternalFailureCheck";
import RunFunctionCheck from "./checks/RunFunctionCheck";

const checks: Check[] = [
  UsageTriggersCheck,
  ApiKeysCheck,
  UnusedNumbersCheck,
  FallbackCheck,
  FlexVoiceSDKCheck,
  FlexPluginLimitCheck,
  SingleWorkflowCheck,
  StuckExecutionsCheck,
  SubflowsCheck,
  ExternalFailureCheck,
  RunFunctionCheck,
];

const App = () => {
  const [checkList, setCheckList] = React.useState(checks);
  const [loading, setLoading] = React.useState(false);
  const [apiError, setApiError] = React.useState(false);

  return (
    <div className="main">
      <Theme.Provider theme="dark">
        <Header
          checkList={checkList}
          setCheckList={setCheckList}
          setLoading={setLoading}
          setApiError={setApiError}
        />
      </Theme.Provider>
      <Theme.Provider theme="default">
        <CheckCardContainer
          checkList={checkList}
          loading={loading}
          apiError={apiError}
        />
      </Theme.Provider>
    </div>
  );
};

const root = ReactDOM.createRoot(
  document.getElementById("content") as HTMLElement
);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
