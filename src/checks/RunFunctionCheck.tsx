import { Twilio } from "twilio";
import { Check, CheckResult } from "./Check";

type StudioFlowDefinitionState = {
  type: string;
};

type StudioFlowDefinition = {
  states: StudioFlowDefinitionState[];
};

class RunFunctionCheck extends Check {
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
        "There are no Studio flows in your account that contain Run Function widgets.",
      status: "success",
    };

    try {
      const flows = await twilioClient.studio.v2.flows.list({
        limit: 100,
      });

      const runFunctionFlows: string[] = [];

      for (const flow of flows) {
        const flowDefinition = await twilioClient.studio.v2
          .flows(flow.sid)
          .fetch();
        const flowContents = flowDefinition.definition as StudioFlowDefinition;

        if (
          flowContents.states &&
          flowContents.states.some((state) => state.type === "run-function")
        ) {
          runFunctionFlows.push(flow.sid);
        }
      }

      if (runFunctionFlows.length) {
        result.result = `The following Studio flows contain a Run Function widget: ${runFunctionFlows.join(
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

export default new RunFunctionCheck(
  "runFunction",
  "Run Function widgets",
  "Be aware of concurrency limits when using Twilio Functions in your Studio flow",
  "Studio",
  "By default, Twilio Functions are limited to 30 concurrent invocations. If you expect your IVR to have high call volumes, consider using the Make HTTP Request widget calling an external service instead.",
  "This check uses the Flows API to check if there are any Run function widgets used in your Studio flows. Please note that the check is limited to the first 100 Studio flows in your account and checks the latest revision of a flow, which may not be the one deployed."
);
