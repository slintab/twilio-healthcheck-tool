import { Twilio } from "twilio";
import { Check, CheckResult } from "./Check";

class CustomCheck extends Check {
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
    /*  
    This function is to be overridden in custom checks with your custom logic
    for determining the result of the check. It should return a CheckResult and have three paths of execution:
    success (check passed), warning (check failed) and error (check could not be run)
    */
    const result: CheckResult = {
      id: this.id,
      result: "Custom check passed",
      status: "success",
    };

    try {
      const response = false;
      if (!response) {
        result.result = "Custom check did not pass!";
        result.status = "warning";
      }
    } catch {
      result.result = "Error running custom check.";
      result.status = "error";
    }

    return result;
  }
}

export default new CustomCheck(
  "customCheck", //check ID, used internally
  "Custom check", // check label in combobox dropdown
  "My custom check", // check title
  "Voice", // check category, should map to a Twilio product/service
  "This custom check is awesome, you should give it a try!", // check description
  "This custom check uses some amazing APIs!" // check methodology
);
