import { Twilio } from "twilio";

export type CheckResult = {
  id: string;
  status: "success" | "warning" | "error";
  result: string;
};

export abstract class Check {
  id: string;
  label: string;
  title: string;
  group: string;
  description: string;
  method: string;
  status?: "success" | "warning" | "error";
  result?: string;

  constructor(
    id: string,
    label: string,
    title: string,
    group: string,
    description: string,
    method: string
  ) {
    this.id = id;
    this.label = label;
    this.title = title;
    this.group = group;
    this.description = description;
    this.method = method;
  }

  abstract getResult(twilioClient: Twilio): Promise<CheckResult>;
}
