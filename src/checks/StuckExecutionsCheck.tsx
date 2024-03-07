import { Twilio } from "twilio";
import { Check, CheckResult } from "./Check";

class StuckExecutionsCheck extends Check {
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
      result: "No stuck executions found.",
      status: "success",
    };

    const getDaysAgoDate = (days: number): Date => {
      const today = new Date();
      today.setDate(today.getDate() - days);
      return today;
    };

    const twentyDaysAgo = getDaysAgoDate(20);
    const twentyFiveDaysAgo = getDaysAgoDate(25);

    let stuckExecutionFlowSid = null;

    try {
      const flows = await twilioClient.studio.v2.flows.list({
        limit: 100,
      });

      flowLoop: for (const flow of flows) {
        const executions = await twilioClient.studio.v2
          .flows(flow.sid)
          .executions.list({
            dateCreatedFrom: twentyFiveDaysAgo,
            dateCreatedTo: twentyDaysAgo,
            limit: 100,
          });
        for (const execution of executions) {
          if (execution.status === "active") {
            const steps = await twilioClient.studio.v2
              .flows(flow.sid)
              .executions(execution.sid)
              .steps.list();

            if (steps.some((step) => step.name === "incomingCall")) {
              stuckExecutionFlowSid = flow.sid;
              break flowLoop;
            }
          }
        }
      }

      if (stuckExecutionFlowSid) {
        result.result = `There are stuck executions in your account, e.g. for flow ${stuckExecutionFlowSid}.`;
        result.status = "warning";
      }
    } catch {
      result.result = "Error retrieving your Studio executions.";
      result.status = "error";
    }

    return result;
  }
}

export default new StuckExecutionsCheck(
  "stuckExecutions",
  "Stuck executions",
  "Avoid stuck Studio flow executions",
  "Studio",
  "A stuck Execution occurs when an inbound call has ended, but Studio is still waiting for a final webhook event to mark the Execution as complete. The most common cause of a stuck Execution is when Studio does not receive a final webhook from Programmable Voice that a call has ended.",
  "This check uses the Executions API to check if there are any executions in your account that have been triggered by an incoming call and been in an active status for over 20 days. Please note that only 100 executions are checked per flow."
);
