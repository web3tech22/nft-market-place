import React, { useEffect, useState } from "react";
import { Grid, Card, Typography, Tooltip } from "@material-ui/core";
import Box from "@mui/material/Box";
import { _account } from "../../CONTRACT-ABI/connect";
import { getSymbol } from "../../utils/currencySymbol";
import { web3Utils } from "../../utils/web3Util";

const styles = {
  card: {
    height: "180px",
    width: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "start",
    flexDirection: "column",
    paddingLeft: "20px",
    paddingRight: "20px",
    boxShadow: "0px 3px 15px rgba(0, 0, 0, 0.08)",
    borderRadius: "5px",
  },
  typo2: {
    fontWeight: "bold",
    fontSize: "20px",
    overflow: "hidden",
    textOverflow: "ellipsis",
    width: "20rem",
  },
};

const WalledCard = () => {
  const [account, setAccount] = useState(null);
  const [networkId, setNetworkId] = useState(null);
  const [balance, setBalance] = useState(null);
  const [network, setNetwork] = useState(null);

  useEffect(() => {
    fetchInfo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchInfo = async () => {
    const account = await _account();
    console.log("------account---->", account);
    setAccount(account);
    const networkId =
      await web3Utils?.eth?.accounts?._ethereumCall?.getNetworkId();
    setNetworkId(networkId);
    const balance = await web3Utils?.eth?.getBalance(account);
    const balnceInETH = await web3Utils?.utils?.fromWei(balance, "ether");
    setBalance(balnceInETH);
    console.log("---------------------->", networkId);
    switch (networkId) {
      case 1:
        setNetwork("Mainnet");
        break;
      case 2:
        setNetwork("Morden");
        break;
      case 3:
        setNetwork("Ropsten");
        break;
      case 4:
        setNetwork("Rinkeby");
        break;
      case 5:
        setNetwork("goerli");
        break;
      case 80001:
        setNetwork("Polygon");
        break;
      default:
        setNetwork("Unknown");
    }
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={4}>
        <Grid item xs={6}>
          <Card style={styles.card}>
            <Typography>Total Balance</Typography>
            <Typography style={styles.typo2}>
              {parseFloat(Number(balance)).toFixed(2)} {getSymbol()}
            </Typography>
          </Card>
        </Grid>
        <Grid item xs={6}>
          <Card style={styles.card}>
            <Typography>My Address</Typography>
            <Tooltip>
              <Typography style={styles.typo2}>{account}</Typography>
            </Tooltip>
          </Card>
        </Grid>
        <Grid item xs={6}>
          <Card style={styles.card}>
            <Typography>Network Type</Typography>
            <Typography style={styles.typo2}>{network}</Typography>
          </Card>
        </Grid>
        <Grid item xs={6}>
          <Card style={styles.card}>
            <Typography>Network Id</Typography>
            <Typography style={styles.typo2}>{networkId}</Typography>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default WalledCard;
