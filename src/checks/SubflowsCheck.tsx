import { Twilio } from "twilio";
import { Check, CheckResult } from "./Check";
import { FormControlTwoColumn } from "@twilio-paste/core";

type StudioFlowDefinitionState = {
  type: string;
};

type StudioFlowDefinition = {
  states: StudioFlowDefinitionState[];
};

class SubflowsCheck extends Check {
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
      result:
        "There are no Studio flows in your account with more than 25 widgets that do not contain a subflow.",
      status: "success",
    };

    try {
      const flows = await twilioClient.studio.v2.flows.list({
        limit: 100,
      });

      const missingSubflows = [];

      for (const flow of flows) {
        const flowDefinition = await twilioClient.studio.v2
          .flows(flow.sid)
          .fetch();
        const flowContents = flowDefinition.definition as StudioFlowDefinition;
        if (!flowContents.states || flowContents.states.length <= 25) {
          continue;
        }

        for (const state of flowContents.states) {
          if (state.type === "run-subflow") {
            break;
          }
        }

        missingSubflows.push(flow.sid);
      }

      if (missingSubflows.length) {
        result.result = `The following Studio flows with more than 25 do not contain a subflow: ${missingSubflows.join(
          ", "
        )}`;
        result.status = "warning";
      }
    } catch {
      result.result = "Error retrieving your Studio flows.";
      result.status = "error";
    }

    return result;
  }
}

export default new SubflowsCheck(
  "subflows",
  "Subflows",
  "Use subflows to simplify Studio flows",
  "Studio",
  "Using subflows you can break apart large, complex Flows into smaller Flows and link them together. This makes it possible to reuse functionality across multiple Studio Flows.",
  "This check uses the Flows API to check if there any flows in your account that contain more than 50 widgets, but do not use the Run subflow widget. Please note that the check is limited to the first 100 Studio flows in your account and checks the latest revision of a flow, which may not be the one deployed."
);
