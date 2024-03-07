import React from "react";
import { Text } from "@twilio-paste/core/text";
import { Paragraph } from "@twilio-paste/core/paragraph";
import { Card } from "@twilio-paste/card";
import { Box } from "@twilio-paste/box";
import { Badge } from "@twilio-paste/core/badge";
import { HelpText } from "@twilio-paste/core/help-text";
import {
  SummaryDetail,
  SummaryDetailHeading,
  SummaryDetailToggleButton,
  SummaryDetailHeadingContent,
  SummaryDetailContent,
} from "@twilio-paste/summary-detail";

import { Check } from "../checks/Check";

interface CheckCardProps {
  check: Check;
}

export default (props: CheckCardProps) => {
  const { check } = props;
  return (
    <Card padding="space30">
      <Box display="flex" justifyContent="space-between" alignItems="start">
        <SummaryDetail visible={!!check.status}>
          <SummaryDetailHeading>
            <SummaryDetailToggleButton aria-label="BOOP" />
            <SummaryDetailHeadingContent>
              <Text as="p" fontWeight="fontWeightBold">
                {check.title}
              </Text>
              <Text as="p" fontSize="fontSize20" fontWeight="fontWeightLight">
                {check.group}
              </Text>
            </SummaryDetailHeadingContent>
          </SummaryDetailHeading>
          <SummaryDetailContent>
            <Text as="strong">Description</Text>
            <Paragraph>{check.description}</Paragraph>
            <Text as="strong">Method</Text>
            <Paragraph>{check.method}</Paragraph>
            {!!check.status && (
              <>
                <Text as="strong">Result</Text>
                <HelpText id="result" variant={check.status}>
                  <Paragraph>{check.result}</Paragraph>
                </HelpText>
              </>
            )}
          </SummaryDetailContent>
        </SummaryDetail>
        {check.status == "success" && (
          <Badge as="span" variant="success" size="small">
            Passed
          </Badge>
        )}
        {check.status == "warning" && (
          <Badge as="span" variant="warning" size="small">
            Failed
          </Badge>
        )}
        {check.status == "error" && (
          <Badge as="span" variant="error" size="small">
            Error
          </Badge>
        )}
      </Box>
    </Card>
  );
};
