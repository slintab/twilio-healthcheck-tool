import React from "react";
import { Box } from "@twilio-paste/box";
import { DisplayHeading } from "@twilio-paste/core/display-heading";

export default () => {
  return (
    <Box paddingBottom="space40" textAlign="center">
      <DisplayHeading as="h1" variant="displayHeading20" marginBottom="space0">
        Twilio Health Check Tool
      </DisplayHeading>
    </Box>
  );
};
