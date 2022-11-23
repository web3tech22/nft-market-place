import React, { useState } from "react";
import { Grid, Card } from "@mui/material";
import { _transction } from "../../CONTRACT-ABI/connect";
import TransctionModal from "../shared/TransctionModal";
import { getSymbol } from "../../utils/currencySymbol";
import { convertEthToWei, convertEthFromWei } from "../../utils/web3Util";
import TextField from '@mui/material/TextField';

const UpdatePrice = ({ price, tokenId, fetchNftInfo }) => {
  const [start, setStart] = useState(false);
  const [response, setResponse] = useState(null);
  const [amount, setAmount] = useState(convertEthFromWei(price));


  const saveData = async () => {
    setStart(true);
    let responseData;

    responseData = await _transction(
      "_setNftPrice",
      tokenId,
      convertEthToWei(amount)
    );

    setResponse(responseData);
    fetchNftInfo();
  };

  const modalClose = () => {
    fetchNftInfo();
    setStart(false);
    setResponse(null);
  };

  return (
    <>
      {start && <TransctionModal response={response} modalClose={modalClose} />}

      <div
        style={{
          paddingBottom: "20px",
          background: "white",
        }}
      >
        <Card style={{ padding: 15 }}>
          <p>Update Price</p>
          <div className="form-group">
            <Grid item lg={6} md={6} sm={12} xs={12} >
              <TextField
                type="text"
                name="amount"
                style={{ marginRight: 10, padding: 6 }}
                value={amount}
                placeholder={`Enter amount (${getSymbol()})`}
                size="small"
                variant="outlined"
                onChange={(e) => setAmount(e.target.value)}
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
