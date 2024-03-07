import React from "react";
import { Box } from "@twilio-paste/box";
import { Button } from "@twilio-paste/core/button";
import { AlertDialog } from "@twilio-paste/alert-dialog";

interface AlertDialogProps {
  handleRunChecks: () => Promise<void>;
  isOpen: boolean;
  handleOpen: () => void;
  handleClose: () => void;
}

export default (props: AlertDialogProps) => {
  const { handleRunChecks, isOpen, handleClose, handleOpen } = props;
  return (
    <Box padding="space50">
      <Button variant="primary" onClick={handleOpen}>
        Run health check
      </Button>
      <AlertDialog
        heading="Confirm health check"
        isOpen={isOpen}
        onConfirm={handleRunChecks}
        onConfirmLabel="Confirm"
        onDismiss={handleClose}
        onDismissLabel="Cancel"
      >
        Running a health check generates a large number of API calls in your
        account. Consider running the check during off-peak hours.
      </AlertDialog>
    </Box>
  );
};
