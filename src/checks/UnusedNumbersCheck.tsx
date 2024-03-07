import { Twilio } from "twilio";
import { Check, CheckResult } from "./Check";

class UnusedNumbersCheck extends Check {
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
      result: "You have no unused numbers.",
      status: "success",
    };

    try {
      const numbers = await twilioClient.incomingPhoneNumbers.list({
        limit: 100,
      });

      const unused = [];

      const get30DaysAgoDate = (): Date => {
        const today = new Date();
        today.setDate(today.getDate() - 30);
        return today;
      };
      const thirtyDaysAgo = get30DaysAgoDate();

      for (const number of numbers) {
        const incomingCalls = await twilioClient.calls.list({
          limit: 1,
          to: number.phoneNumber,
          startTimeAfter: thirtyDaysAgo,
        });
        if (incomingCalls.length) {
          continue;
        }

        const outgoingCalls = await twilioClient.calls.list({
          limit: 1,
          from: number.phoneNumber,
          startTimeAfter: thirtyDaysAgo,
        });
        if (outgoingCalls.length) {
          continue;
        }

        const incomingSms = await twilioClient.messages.list({
          limit: 1,
          to: number.phoneNumber,
          dateSentAfter: thirtyDaysAgo,
        });
        if (incomingSms.length) {
          continue;
        }
        const outgoingSms = await twilioClient.messages.list({
          limit: 1,
          from: number.phoneNumber,
          dateSentAfter: thirtyDaysAgo,
        });
        if (outgoingSms.length) {
          continue;
        }

        unused.push(number.phoneNumber);
      }

      if (unused) {
        result.status = "warning";
        result.result = `The following phone numbers have not been used in the last 30 days: ${unused.join(
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

export default new UnusedNumbersCheck(
  "unusedNumbers",
  "Unused numbers",
  "Release unused phone numbers",
  "Phone numbers",
  "Release numbers you do not use. You can always get more numbers when you need them. There is no charge to release a number and you can restore it within 10 days if you change your mind.",
  "This check uses the Messages and the Calls API to check if there has been any activity on your phone numbers in the last month. Note that the check is limited to the first 100 numbers in your account."
);
