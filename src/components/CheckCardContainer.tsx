import React from "react";
import { Box } from "@twilio-paste/box";
import { Stack } from "@twilio-paste/stack";
import { Check } from "../checks/Check";
import CheckCard from "./CheckCard";
import Spinner from "./Spinner";
import ErrorMessage from "./ErrorMessage";

interface CheckCardContainerProps {
  checkList: Check[];
  loading: boolean;
  apiError: boolean;
}

export default (props: CheckCardContainerProps) => {
  const { checkList, loading, apiError } = props;

  return (
    <Box
      width="100%"
      fontSize="fontSize100"
      display="flex"
      padding="space130"
      flexDirection="column"
    >
      <Stack orientation="vertical" spacing="space40">
        {loading && <Spinner />}
        {apiError && <ErrorMessage />}
        {!loading &&
          !apiError &&
          checkList.map((check) => <CheckCard key={check.id} check={check} />)}
      </Stack>
    </Box>
  );
};
