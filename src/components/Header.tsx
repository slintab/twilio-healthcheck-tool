import React from "react";
import axios, { AxiosResponse } from "axios";
import { Box } from "@twilio-paste/box";
import { Check, CheckResult } from "../checks/Check";
import AlertDialog from "./AlertDialog";
import Combobox from "./Combobox";
import Subheading from "./Subheading";
import Heading from "./Heading";

interface SelectBarProps {
  checkList: Check[];
  setCheckList: (checks: Check[]) => void;
  setLoading: (isLoading: boolean) => void;
  setApiError: (isApiError: boolean) => void;
}

export default (props: SelectBarProps) => {
  const { checkList, setCheckList, setLoading, setApiError } = props;
  const defaultHelpText =
    "If you have many resources, consider running each check separately.";
  const [selectedChecks, setSelectedChecks] = React.useState<string[]>([]);
  const [inputValue, setInputValue] = React.useState("");
  const [comboboxHelpText, setComboboxHelpText] =
    React.useState(defaultHelpText);
  const [comboboxError, setComboboxError] = React.useState(false);
  const [isOpen, setIsOpen] = React.useState(false);
  const handleOpen = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false);

  const getFilteredItems = (inputValue: string) =>
    checkList.filter((item) =>
      item.label.toLowerCase().includes(inputValue.toLowerCase())
    );

  const fetchResults = async () => {
    const resp: AxiosResponse<{ checks: CheckResult[] }> = await axios.post(
      "/run",
      {
        checks: selectedChecks,
      }
    );
    const results = checkList.map((check) => {
      const result = resp.data.checks.find((result) => result.id === check.id);
      return result ? Object.assign(check, result) : check;
    });
    return results;
  };

  const handleRunChecks = async () => {
    if (!selectedChecks.length) {
      setComboboxError(true);
      setComboboxHelpText("Please select at least one check from the list.");
      handleClose();
      return;
    }

    handleClose();
    setComboboxError(false);
    setComboboxHelpText(defaultHelpText);
    setLoading(true);
    try {
      const results = await fetchResults();
      setCheckList(results);
    } catch (e) {
      console.log("Error running health checks:", e);
      setApiError(true);
    }
    setLoading(false);
  };

  return (
    <Box
      backgroundColor="colorBackgroundBodyInverse"
      width="100%"
      paddingTop="space200"
    >
      <Box
        padding="space100"
        display="flex"
        flexDirection="column"
        alignItems="center"
      >
        <Heading />
        <Subheading />
        <Combobox
          setInputValue={setInputValue}
          inputValue={inputValue}
          getFilteredItems={getFilteredItems}
          setSelectedChecks={setSelectedChecks}
          comboboxError={comboboxError}
          comboboxHelpText={comboboxHelpText}
        />
        <AlertDialog
          handleRunChecks={handleRunChecks}
          isOpen={isOpen}
          handleOpen={handleOpen}
          handleClose={handleClose}
        />
      </Box>
    </Box>
  );
};
