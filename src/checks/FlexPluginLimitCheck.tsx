import { Twilio } from "twilio";
import { Check, CheckResult } from "./Check";
import Response from "twilio/lib/http/response";

type PluginRelease = {
  url: string;
  date_created: string;
  configuration_sid: string;
  account_sid: string;
  sid: string;
};

type PluginReleaseResponse = {
  releases: PluginRelease[];
};
type PluginsResponse = {
  plugins: unknown[];
};

class FlexPluginLimitCheck extends Check {
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
      result: "You are below the plugin limit.",
      status: "success",
    };

    const getLatestRelease = async (): Promise<PluginRelease> => {
      const response: Response<Request> = await twilioClient.request({
        method: "get",
        uri: "https://flex-api.twilio.com/v1/PluginService/Releases",
      });

      if (response.statusCode === 400) {
        throw new Error("Not a Flex account.");
      }

      const result = response.body as unknown as PluginReleaseResponse;
      if (!result.releases.length) {
        throw new Error("No releases.");
      }

      return result.releases[0];
    };

    const getPlugins = async (configurationSid: string): Promise<unknown[]> => {
      const response: Response<Request> = await twilioClient.request({
        method: "get",
        uri: `https://flex-api.twilio.com/v1/PluginService/Configurations/${configurationSid}/Plugins`,
      });

      const result = response.body as unknown as PluginsResponse;
      return result.plugins;
    };

    try {
      const { configuration_sid } = await getLatestRelease();
      const plugins = await getPlugins(configuration_sid);

      if (plugins.length > 20) {
        result.result = `You are getting close to the plugin limit (25): there are ${plugins.length} plugins in your Flex instance.`;
        result.status = "warning";
      }
    } catch (e) {
      result.result = "Error retrieving your Flex plugins.";
      result.status = "error";
    }

    return result;
  }
}

export default new FlexPluginLimitCheck(
  "flexPluginLimit",
  "Plugin limit",
  "Consider a monoplugin approach if you are nearing the plugin limit",
  "Flex",
  "By default, Twilio Flex supports up to 25 plugins. If you are nearing the plugin limit, consider a monoplugin structure. For an example take a look at the Flex Project template.",
  "This check uses the Flex Plugins API to check the number of installed plugins in your account."
);
