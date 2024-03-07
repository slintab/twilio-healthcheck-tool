import { Twilio } from "twilio";
import { Check, CheckResult } from "./Check";

class FallbackCheck extends Check {
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
      result: "You have fallback URLs configured for your phone numbers.",
      status: "success",
    };

    try {
      const numbers = await twilioClient.incomingPhoneNumbers.list({
        limit: 100,
      });

      const unconfigured = numbers
        .map((number) =>
          (number.smsUrl && !number.smsFallbackUrl) ||
          (number.voiceUrl && !number.voiceFallbackUrl)
            ? number.phoneNumber
            : null
        )
        .filter((value) => value !== null);

      if (unconfigured) {
        result.status = "warning";
        result.result = `The following phone numbers do not have a fallback URL configured: ${unconfigured.join(
          ", "
        )}`;
      }
    } catch {
      result.result = "Error retrieving your phone numbers.";
      result.status = "error";
    }

    return result;
  }
}

export default new FallbackCheck(
  "fallback",
  "Fallback URLs",
  "Configure fallback webhook URLs for phone numbers",
  "Phone numbers",
  "A Fallback URL is a URL that Twilio requests in the event of a fatal error while making a request to your primary webhook URL. You can configure a Fallback URL in the same place that you set your default webhook URL.",
  "This check uses the IncomingPhoneNumber API to check if a fallback URL has been configured for your phone numbers. Note that the check is limited to the first 100 numbers in your account."
);
