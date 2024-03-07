import { Twilio } from "twilio";
import { Check, CheckResult } from "./Check";

class UsageTriggersCheck extends Check {
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
      result: "You have no usage triggers configured",
      status: "warning",
    };

    try {
      const triggers = await twilioClient.usage.triggers?.list({ limit: 1 });
      if (triggers?.length) {
        result.result = "You have usage triggers configured.";
        result.status = "success";
      }
    } catch {
      result.result = "Error retrieving usage triggers.";
      result.status = "error";
    }

    return result;
  }
}

export default new UsageTriggersCheck(
  "usageTriggers",
  "Usage triggers",
  "Configure usage triggers",
  "Accounts",
  "The Twilio API has many capabilities, including allowing you to keep track of how much money you spend on it by configuring usage triggers.",
  "This check uses the UsageTriggers API to check if there are any usage triggers configured in your account."
);
