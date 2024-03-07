import React from "react";
import { Spinner } from "@twilio-paste/core/spinner";
import { Box } from "@twilio-paste/core/box";
import { Paragraph } from "@twilio-paste/core";

export default () => {
  return (
    <Box display="flex" alignItems="center" flexDirection="column">
      <Spinner decorative={false} title="Loading" size="sizeIcon80" />
      <Paragraph>Loading results...</Paragraph>
    </Box>
  );
};
