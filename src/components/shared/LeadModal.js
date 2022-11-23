import React, { useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import { Grid } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import PhoneInTalkIcon from "@mui/icons-material/PhoneInTalk";
import swal from "sweetalert";
import LoadingButton from "@mui/lab/LoadingButton";
import SaveIcon from "@mui/icons-material/Save";
import { _account } from "../../CONTRACT-ABI/connect";
import TextField from '@mui/material/TextField';
import { ConfigContext } from "../../App";

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

const getAuthToken = async (configs) => {
  var myHeaders = new Headers();

  myHeaders.append("clientid", configs?.ms_dynamics_client_id);

  var requestOptions = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow",
  };

  return await fetch(
    `${configs?.ms_dynamics_base_url}/Accounts/GetAuthToken`,
    requestOptions
  )
    .then((response) => response.json())
    .then((result) => result)
    .catch((error) => error);
};

const caeateLead = async (requestData, configs) => {
  const getAuth = await getAuthToken(configs);
  if (getAuth?.statusCode === 200) {
    var myHeaders = new Headers();
    myHeaders.append("Auth-Token", getAuth?.data);
    myHeaders.append("Content-Type", "application/json");
    var raw = JSON.stringify(requestData);
    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };
    return await fetch(
      `${configs?.ms_dynamics_base_url}/Leads/Create`,
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => true)
      .catch((error) =>
        swal("Network issue!", "Please re-submit again", "warning").then(
          (value) => {
            return false;
          }
        )
      );
  } else {
    swal("Sorry!", "Some error occured", "error");
    return false;
  }
};

export default function BasicModal() {
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const configs = React.useContext(ConfigContext);


  const [firstname, setfirstname] = useState('');
  const [lastname, setlastname] = useState('');
  const [contactNo, setcontactNo] = useState('');
  const [emailAddress1, setemailAddress1] = useState('');


  const saveData = async () => {
    setLoading(true);
    const account = await _account();
    const requestData = {
      firstname: firstname,
      lastname: lastname,
      contactNo: contactNo,
      emailAddress1: emailAddress1,
      wallet_address: account,
      subject: "Contact us",
      website: window.location.href,
    };
    if (await caeateLead(requestData, configs)) {
      swal("Thank you!", "Our team will contact you soon", "success").then(
        (value) => {
          handleClose();
        }
      );
    }

    setLoading(false);
  };

  return (
    <div>
      <IconButton
        color="primary"
        aria-label="upload picture"
        component="label"
        onClick={handleOpen}
        style={{ color: "white", cursor: "pointer" }}
      >
        <small style={{ fontSize: 14, marginRight: 5 }}>Contact Us</small>
        <PhoneInTalkIcon style={{ color: "white", fontSize: 25 }} />
      </IconButton>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <h2>Contact Us</h2>
          <Grid container>
            <Grid item lg={12} md={12} sm={12} xs={12}>
              <div
                className="form-group"
                style={{ marginLeft: 10, marginTop: 10 }}
              >
                <label for="title" className="my-2">
                  First name <span className="text-danger">*</span>
                </label>
                <TextField
                  style={{ marginRight: 10, padding: 9 }}
                  type="text"
                  name="firstname"
                  placeholder="Enter firstname"
                  size="small"
                  variant="outlined"
                  onChange={(e) => {
                    setfirstname(e.target.value)
                  }
                  }
                />
              </div>
            </Grid>
            <Grid item lg={12} md={12} sm={12} xs={12}>
              <div
                className="form-group"
                style={{ marginLeft: 10, marginTop: 10 }}
              >
                <label for="title" className="my-2">
                  Last name <span className="text-danger">*</span>
                </label>
                <TextField
                  style={{ marginRight: 10, padding: 9 }}
                  type="text"
                  name="lastname"
                  placeholder="Enter lastname"
                  size="small"
                  variant="outlined"
                  onChange={(e) => {
                    setlastname(e.target.value)
                  }
                  }
                />
              </div>
            </Grid>
            <Grid item lg={12} md={12} sm={12} xs={12}>
              <div
                className="form-group"
                style={{ marginLeft: 10, marginTop: 10 }}
              >
                <label for="title" className="my-2">
                  Contact No <span className="text-danger">*</span>
                </label>
                <TextField
                  style={{ marginRight: 10, padding: 9 }}
                  type="number"
                  name="contactNo"
                  placeholder="Enter contactNo"
                  size="small"
                  variant="outlined"
                  onChange={(e) => {
                    setcontactNo(e.target.value)
                  }
                  }
                />
              </div>
            </Grid>
            <Grid item lg={12} md={12} sm={12} xs={12}>
              <div
                className="form-group"
                style={{ marginLeft: 10, marginTop: 10 }}
              >
                <label for="title" className="my-2">
                  Email <span className="text-danger">*</span>
                </label>
                <TextField
                  style={{ marginRight: 10, padding: 9 }}
                  type="text"
                  name="emailAddress1"
                  placeholder="Enter email"
                  size="small"
                  variant="outlined"
                  onChange={(e) => {
                    setcontactNo(e.target.value)
                  }
                  }
                />
              </div>
            </Grid>

            <Grid item lg={12} md={12} sm={12} xs={12}>
              <div
                className="form-group"
                style={{
                  marginTop: 10,
                  float: "right",
                }}
              >
                <span className="input-group-btn">
                  {loading ? (
                    <LoadingButton
                      loading
                      loadingPosition="start"
                      variant="outlined"
                      startIcon={<SaveIcon />}
                    >
                      Please wait ...
                    </LoadingButton>
                  ) : (
                    <Button
                      variant="contained"
                      size="large"
                      sx={{
                        marginX: "15px",
                        marginBottom: "15px",
                      }}
                      type="submit"
                      value={"Submit"}
                      style={{
                        fontSize: 16,
                        padding: "10px 24px",
                        borderRadius: 12,
                        marginTop: 10,
                      }}
                    >
                      Submit
                    </Button>
                  )}
                </span>
              </div>
            </Grid>
          </Grid>
        </Box>
      </Modal>
    </div>
  );
}
