const CheckFactory = require("../assets/checkFactory").CheckFactory;

exports.handler = async (context, event, callback) => {
  const { checks } = event;
  const response = new Twilio.Response();
  const twilioClient = context.getTwilioClient();

  if (!checks) {
    response.setStatusCode(400);
    response.setBody("Missing checks parameter.");
    return callback(null, response);
  }
  try {
    const results = [];
    const pendingResults = checks.map((check) =>
      CheckFactory.createCheck(check).getResult(twilioClient)
    );
    const resolvedResults = await Promise.allSettled(pendingResults);
    resolvedResults.forEach((result) =>
      result.status === "fulfilled" ? results.push(result.value) : null
    );
    response.setBody({ checks: results });
  } catch (e) {
    console.log(e);
    response.setStatusCode(500);
    response.setBody(e.message);
  }
  return callback(null, response);
};
