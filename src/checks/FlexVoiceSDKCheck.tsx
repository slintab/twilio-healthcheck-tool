import { Twilio } from "twilio";
import { Check, CheckResult } from "./Check";

class FlexVoiceSDKCheck extends Check {
  constructor(
    id: string,
    label: string,
    title: string,
    group: string,
    description: string,
    method: string
  ) {
    super(id, label, title, group, description, method);
  }

  async getResult(twilioClient: Twilio): Promise<CheckResult> {
    const result: CheckResult = {
      id: this.id,
      result: "You are not using the recommended voice SDK configuration.",
      status: "warning",
    };

    try {
      const flexConfig = await twilioClient.flexApi.v1.configuration
        .get()
        .fetch();
      const voiceSdkOptions = flexConfig.uiAttributes?.sdkOptions?.voice;

      if (
        voiceSdkOptions?.enableIceRestart &&
        voiceSdkOptions?.codecPreferences?.[0] === "opus"
      ) {
        result.result = `You are using the recommended voice SDK configuration.`;
        result.status = "success";
      }
    } catch (e) {
      result.result = "Error retrieving your Flex configuration.";
      result.status = "error";
    }

    return result;
  }
}

export default new FlexVoiceSDKCheck(
  "flexVoiceSDK",
  "Voice SDK options",
  "Consider overriding the default Voice SDK options",
  "Flex",
  "Consider setting the default codec to Opus and enabling automatic media reconnection.",
  "This check uses the Flex Configuration API to check if the recommended voice SDK configuration is set."
);
