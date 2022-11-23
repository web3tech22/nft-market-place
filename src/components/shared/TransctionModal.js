import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import CircularProgress from "@mui/material/CircularProgress";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Divider from "@mui/material/Divider";
import ListItemText from "@mui/material/ListItemText";
import { networkURL, getBaseApiUrl, getApiKey } from "../../config";
import { ConfigContext } from "../../App";
const steps = ["Initiating", "Waiting for confirmation", "Transction complete"];

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

export default function TransctionModal({ response, setStart, modalClose }) {
  const [open, setOpen] = React.useState(true);
  const [loading, setLoading] = React.useState(true);
  const configs = React.useContext(ConfigContext);
  const domData = response?.error ? response.error.receipt : response;

  const handleClose = () => {
    setOpen(false);
    modalClose();
  };

  let interval;
  if (domData?.hash) {
    interval = setInterval(function () {
      fetchData();
    }, 9000);
  }

  const fetchData = () => {
    var requestOptions = {
      method: "GET",
      redirect: "follow",
    };

    fetch(
      `${getBaseApiUrl(
        configs
      )}?module=transaction&action=gettxreceiptstatus&txhash=${
        domData?.hash
      }&apikey=${getApiKey(configs)}`,
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        console.log(result?.result?.status);
        if (result?.result?.status === "1") {
          setLoading(false);
          clearInterval(interval);
        }
      })
      .catch((error) => console.log("error", error));
  };

  return (
    <div>
      <Modal
        open={open}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={{ ...style, width: 700 }}>
          <Stepper activeStep={domData ? 3 : 1} alternativeLabel>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          <center>
            <Typography
              id="modal-modal-title"
              variant="h6"
              component="h2"
              style={{ marginTop: 30 }}
            >
              {domData ? (
                domData?.hash ? (
                  <b style={{ color: "green" }}>
                    {!loading
                      ? "Transction complete"
                      : "Transction Confirmed! Fetching info..."}
                  </b>
                ) : (
                  <b style={{ color: "red" }}>Transction failed</b>
                )
              ) : (
                "Waiting for confirmation"
              )}
            </Typography>
            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
              {domData?.hash
                ? "Transactions request complete."
                : "Transactions have been initiated. Waiting for confirmation."}
            </Typography>

            {domData?.hash && (
              <List sx={{ width: "100%", bgcolor: "background.paper" }}>
                <ListItem alignItems="flex-start">
                  <ListItemText
                    primary="Transaction hash"
                    secondary={
                      <React.Fragment>
                        <a
                          href={`${networkURL(configs)}/tx/${domData?.hash}`}
                          target="_blank"
                          rel="noreferrer"
                        >
                          {domData?.hash}
                        </a>
                      </React.Fragment>
                    }
                  />
                </ListItem>
                <Divider variant="inset" component="li" />
                <ListItem alignItems="flex-start">
                  <ListItemText
                    primary="Nonce"
                    secondary={
                      <React.Fragment>{domData?.nonce}</React.Fragment>
                    }
                  />
                </ListItem>
                <Divider variant="inset" component="li" />
                <ListItem alignItems="flex-start">
                  <ListItemText
                    primary="Transction From"
                    secondary={<React.Fragment>{domData?.from}</React.Fragment>}
                  />
                </ListItem>
                <Divider variant="inset" component="li" />
                <ListItem alignItems="flex-start">
                  <ListItemText
                    primary="Transction from"
                    secondary={<React.Fragment>{domData?.from}</React.Fragment>}
                  />
                </ListItem>
                <Divider variant="inset" component="li" />
                <ListItem alignItems="flex-start">
                  <ListItemText
                    primary="Transction to"
                    secondary={<React.Fragment>{domData?.to}</React.Fragment>}
                  />
                </ListItem>
                <Divider variant="inset" component="li" />
              </List>
            )}

            {domData && !loading ? (
              <Button
                variant="contained"
                onClick={(e) => handleClose()}
                style={{ marginTop: 20 }}
              >
                {!loading ? "Close" : "Please wait ..."}
              </Button>
            ) : response?.error?.code === 4001 ? (
              <>
                <p style={{ color: "red", marginTop: 20 }}>
                  {response?.error?.message}
                </p>
                <Button
                  variant="contained"
                  onClick={(e) => handleClose()}
                  style={{ marginTop: 20 }}
                >
                  Close
                </Button>
              </>
            ) : (
              <CircularProgress style={{ marginTop: 30 }} />
            )}
          </center>
        </Box>
      </Modal>
    </div>
  );
}
