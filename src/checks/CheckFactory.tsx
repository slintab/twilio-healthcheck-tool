import { Check } from "./Check";
import ApiKeysCheck from "./ApiKeysCheck";
import ExternalFailureCheck from "./ExternalFailureCheck";
import FallbackCheck from "./FallbackCheck";
import FlexPluginLimitCheck from "./FlexPluginLimitCheck";
import FlexVoiceSDKCheck from "./FlexVoiceSDKCheck";
import RunFunctionCheck from "./RunFunctionCheck";
import SingleWorkflowCheck from "./SingleWorkflowCheck";
import StuckExecutionsCheck from "./StuckExecutionsCheck";
import SubflowsCheck from "./SubflowsCheck";
import UnusedNumbersCheck from "./UnusedNumbersCheck";
import UsageTriggersCheck from "./UsageTriggersCheck";

export class CheckFactory {
  static createCheck(checkId: string): Check {
    switch (checkId) {
      case "usageTriggers":
        return UsageTriggersCheck;
      case "apiKeys":
        return ApiKeysCheck;
      case "unusedNumbers":
        return UnusedNumbersCheck;
      case "fallback":
        return FallbackCheck;
      case "flexVoiceSDK":
        return FlexVoiceSDKCheck;
      case "flexPluginLimit":
        return FlexPluginLimitCheck;
      case "singleWorkflow":
        return SingleWorkflowCheck;
      case "subflows":
        return SubflowsCheck;
      case "stuckExecutions":
        return StuckExecutionsCheck;
      case "externalFailure":
        return ExternalFailureCheck;
      case "runFunction":
        return RunFunctionCheck;

      default:
        throw new Error(`Invalid check id: ${checkId}`);
    }
  }
}
