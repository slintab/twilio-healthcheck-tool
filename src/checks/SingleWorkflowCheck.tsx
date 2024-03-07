import { Twilio } from "twilio";
import { Check, CheckResult } from "./Check";

class SingleWorkflowCheck extends Check {
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
      result: "Your routing configuration uses a single workflow.",
      status: "warning",
    };

    try {
      const workspaces = await twilioClient.taskrouter.v1.workspaces.list({
        friendlyName: "Flex Task Assignment",
      });

      if (!workspaces.length) {
        throw new Error("Not a Flex account.");
      }

      const workspaceSid = workspaces[0].sid;
      const workflows = await twilioClient.taskrouter.v1
        .workspaces(workspaceSid)
        .workflows.list({ limit: 2 });

      if (workflows.length > 1) {
        result.result =
          "You are using more than one workflow in your routing configuration.";
        result.status = "success";
      }
    } catch (e) {
      result.result =
        "Error retrieving your Flex Taskrouter workspace configuration.";
      result.status = "error";
    }

    return result;
  }
}

export default new SingleWorkflowCheck(
  "singleWorkflow",
  "Single workflow",
  "Use multiple workflows to simplify routing",
  "Flex",
  "A Workflow defines the rules for distributing Tasks to Workers. Use more than one workflow in your contact center to simplify your routing logic.",
  "This check uses the Workflows API to check the number of workflows in your account."
);
