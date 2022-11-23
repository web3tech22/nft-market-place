import React, { useState } from "react";
import TextField from '@mui/material/TextField';
import { Card, Grid } from "@mui/material";
import { _transction, _account } from "../../CONTRACT-ABI/connect";
import TransctionModal from "../shared/TransctionModal";


const UpdatePrice = ({ price, tokenId, fetchNftInfo }) => {
  const [start, setStart] = useState(false);
  const [response, setResponse] = useState(null);
  const [transferTo, setTransferTo] = useState('');


  const saveData = async () => {
    setStart(true);
    let responseData;
    const account = await _account();
    responseData = await _transction("safeTransferFrom", account, transferTo, tokenId);

    setResponse(responseData);
    fetchNftInfo();
  };

  const modalClose = () => {
    setStart(false);
    setResponse(null);
    fetchNftInfo();
  };

  return (
    <>
      {start && <TransctionModal response={response} modalClose={modalClose} />}

      <div
        style={{
          paddingTop: "20px",
          background: "white",
        }}
      >
        <Card style={{ padding: 15 }}>
          <p>Transfer your NFT</p>

          <div className="form-group">
            <Grid item lg={6} md={6} sm={12} xs={12}>
              <TextField
                style={{ marginRight: 10, padding: 6 }}
                type="text"
                name="to"
                placeholder={`Enter Wallet Address ( example: 0x9A13... )`}
                size="small"
                variant="outlined"
                onChange={(e) => {
                  setTransferTo(e.target.value)
                }
                }
              />
            </Grid>
          </div>

          <div className="form-group" style={{ marginTop: 20 }}>
            <span className="input-group-btn">
              <input
                className="btn btn-default btn-primary"
                onClick={() => {
                  saveData();
                }}
              />
            </span>
          </div>
        </Card>
      </div>
    </>
  );
};
export default UpdatePrice;
