import React from "react";
import { Box } from "@twilio-paste/box";
import { MultiselectCombobox } from "@twilio-paste/combobox";
import { Check } from "../checks/Check";

interface ComboboxProps {
  setInputValue: (input: string) => void;
  inputValue: string;
  getFilteredItems: (input: string) => Check[];
  setSelectedChecks: (checks: string[]) => void;
  comboboxError: boolean;
  comboboxHelpText: string;
}

export default (props: ComboboxProps) => {
  const {
    setInputValue,
    inputValue,
    getFilteredItems,
    setSelectedChecks,
    comboboxError,
    comboboxHelpText,
  } = props;
  const filteredItems = React.useMemo(
    () => getFilteredItems(inputValue),
    [inputValue]
  );

  return (
    <Box padding="space70">
      <MultiselectCombobox
        groupItemsBy="group"
        items={filteredItems}
        itemToString={(item) => (item ? item.label : "")}
        onInputValueChange={({ inputValue: newInputValue = "" }) => {
          setInputValue(newInputValue);
        }}
        labelText="Select checks to run:"
        selectedItemsLabelText="Selected checks"
        helpText={comboboxHelpText}
        optionTemplate={(item) => <div>{item.label}</div>}
        hasError={comboboxError}
        onSelectedItemsChange={(selectedItems) => {
          const selectedChecks = (selectedItems as unknown as Array<Check>).map(
            (i) => i.id
          );
          setSelectedChecks(selectedChecks);
        }}
      />
    </Box>
  );
};
