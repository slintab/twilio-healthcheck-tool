import { Twilio } from "twilio";
import { Check, CheckResult } from "./Check";

class ApiKeysCheck extends Check {
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
      result: "You have no API keys configured",
      status: "warning",
    };

    try {
      const keys = await twilioClient.keys.list({ limit: 2 });
      console.log(keys);
      for (const key of keys) {
        if (!key.friendlyName.startsWith("twilio-cli")) {
          result.result = "You have API keys configured.";
          result.status = "success";
          break;
        }
      }
    } catch {
      result.result = "Error retrieving API keys.";
      result.status = "error";
    }

    return result;
  }
}

export default new ApiKeysCheck(
  "apiKeys",
  "API keys",
  "Use API keys instead of your auth token",
  "Accounts",
  "API Keys are the preferred way to authenticate with Twilio's REST APIs. With API Keys, you control which applications and/or people have access to your Twilio Account's API resources, and you can revoke access at your discretion. You can use your Account SID and Auth Token as your API credentials for local testing, but using them in production is not recommended.",
  "This check uses the Keys API to check for provisioned API keys."
);
