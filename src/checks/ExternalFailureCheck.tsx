import { Twilio } from "twilio";
import { Check, CheckResult } from "./Check";

type StudioFlowDefinitionStateTransition = {
  event: string;
  next: string;
};

type StudioFlowDefinitionState = {
  type: string;
  transitions: StudioFlowDefinitionStateTransition[];
};

type StudioFlowDefinition = {
  states: StudioFlowDefinitionState[];
};

class ExternalFailureCheck extends Check {
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
        "All Run Function and Make HTTP Request widgets have a transition configured for when they fail in your Studio flows.",
      status: "success",
    };

    try {
      const flows = await twilioClient.studio.v2.flows.list({
        limit: 100,
      });

      const unhandledFailureFlows = [];

      for (const flow of flows) {
        const flowDefinition = await twilioClient.studio.v2
          .flows(flow.sid)
          .fetch();
        const flowContents = flowDefinition.definition as StudioFlowDefinition;

        if (!flowContents.states) {
          continue;
        }

        const hasUnhandledFailure = flowContents.states.some((state) => {
          if (
            state.type === "run-function" ||
            state.type === "make-http-request"
          ) {
            return state.transitions.some((transition) => {
              return transition.event.startsWith("fail") && !transition.next;
            });
          }
          return false;
        });

        if (hasUnhandledFailure) {
          unhandledFailureFlows.push(flow.sid);
        }
      }

      if (unhandledFailureFlows.length) {
        result.result = `The following Studio flows contain Run Function or Make HTTP Request widgets without a transition configured for when they fail: ${unhandledFailureFlows.join(
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

export default new ExternalFailureCheck(
  "externalFailure",
  "Exception handling",
  "Handle exceptions when calling external services from your Studio flow",
  "Studio",
  "When calling external resources from your Studio flow, ensure that potential failures are handled gracefully so that your Studio Flow knows what to do if if the request fails some way.",
  "This check uses the Flows API to check if any Run function and Make HTTP Request widgets have a transition configured for when they fail."
);
