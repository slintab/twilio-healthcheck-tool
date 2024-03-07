import React from "react";
import { Alert } from "@twilio-paste/core/alert";
import { Box } from "@twilio-paste/core/box";
import {
  Callout,
  CalloutHeading,
  CalloutText,
} from "@twilio-paste/core/callout";

export default () => {
  return (
    <Box display="flex" flexDirection="column">
      <Callout variant="error">
        <CalloutHeading as="h2">Error</CalloutHeading>
        <CalloutText>There was an error loading check results.</CalloutText>
      </Callout>
    </Box>
  );
};
