import React, { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { Tooltip } from "@mui/material";
import Avatars from "./Avatars";
import { useNavigate } from "react-router-dom";
import { _fetch, _account } from "../../CONTRACT-ABI/connect";
import { buyNft } from "../../functions/buyNft";
import TransctionModal from "./TransctionModal";
import MarkAsFevourite from "./MarkAsFevourite";
import RedirectToOpenSea from "./RedirectToOpenSea";
import { getIcon } from "../../utils/currencyIcon";
import { getSymbol } from "../../utils/currencySymbol";
import { get_url_extension, allowableVideoFormat } from "../../utils/fileInfo";
import imgNotFound from "../../assets/images/default-placeholder.png";

export default function NFTCard({ tokenId, reload = () => null }) {
  const [nftData, setNftData] = useState(null);
  const [start, setStart] = useState(false);
  const [price, setPrice] = useState(null);
  const [response, setResponse] = useState(null);
  const [owner, setOwner] = useState(null);
  const [account, setAccount] = useState(null);

  let history = useNavigate();

  useEffect(() => {
    fetchNftInfo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function fetchNftInfo() {
    try {
      const getAllTokenUri = await _fetch("tokenURI", tokenId);
      const price = await _fetch("getNftPrice", tokenId);
      setPrice(price);
      const getOwner = await _fetch("ownerOf", tokenId);
      setOwner(getOwner);
      const account = await _account();
      setAccount(account);
      // console.log("---getAllTokenUri--->", getAllTokenUri);
      await fetch(getAllTokenUri)
        .then((response) => response.json())
        .then((data) => {
          setNftData(data);
        });
    } catch (err) {
      console.error("Unable to fetch data from IPFS", err);
    }
  }

  const buynow = async () => {
    setStart(true);
    const responseData = await buyNft(Number(tokenId));
    setResponse(responseData);
    fetchNftInfo();
  };

  const modalClose = () => {
    setStart(false);
    setResponse(null);
    fetchNftInfo();
  };
  // console.log("----------->", nftData);
  return (
    <>
      {start && <TransctionModal response={response} modalClose={modalClose} />}

      {nftData?.image && (
        <Card
          sx={{
            height: "100%",
            // width: "100%",
            display: "flex",
            flexDirection: "column",
            backgroundColor: "white",
            border: "0.01px solid rgba(0, 0, 0, 0.09)",
          }}
        >
          <Grid container>
            <Grid xs={2}>
              <MarkAsFevourite tokenId={tokenId} reload={reload} />
            </Grid>
            <Grid xs={10} sx={{ textAlign: "right" }}>
              <RedirectToOpenSea tokenId={tokenId} />
            </Grid>
          </Grid>

          {allowableVideoFormat.includes(get_url_extension(nftData?.image)) ? (
            <video height="150" controls>
              <source src={nftData?.image} type="video/mp4" />
              <source src={nftData?.image} type="video/ogg" />
              Your browser does not support HTML video.
            </video>
          ) : (
            <img
              src={nftData?.image}
              alt="NFT img"
              height="150"
              onError={(e) => {
                e.currentTarget.src = imgNotFound;
              }}
            />
          )}

          {/* </Tooltip> */}

          <CardContent style={{ paddingBottom: 0 }}>
            <Avatars />
            <Typography
              style={{ fontSize: 14, cursor: "pointer" }}
              variant="body2"
              paragraph
              item
              fontWeight="600"
              sx={{
                overflow: "hidden",
                textOverflow: "ellipsis",
                width: "11rem",
              }}
              onClick={(e) => {
                e.stopPropagation();
                e.nativeEvent.stopImmediatePropagation();
                history(`/details/${tokenId}`);
                return;
              }}
            >
              {nftData?.name} #{tokenId.toString()}
            </Typography>

            <div
              style={{
                display: "flex",
                justifyContent: "flex-start",
              }}
            >
              <Tooltip title="Ethereum">
                <img
                  alt="nft"
                  width="15px"
                  height="15px"
                  src={getIcon()}
                  style={{ marginRight: 5 }}
                ></img>
              </Tooltip>
              <p>
                <span className="text-secondary" style={{ color: "grey" }}>
                  Price{" "}
                </span>
                <strong style={{ fontSize: 12, fontWeight: "bold" }}>
                  {price / 1000000000000000000} {getSymbol()}
                </strong>
              </p>
            </div>
          </CardContent>

          {owner !== account && (
            <Button
              variant="outlined"
              size="small"
              sx={{
                marginX: "15px",
                marginBottom: "15px",
              }}
              onClick={() => buynow()}
              style={{
                border: "2px solid #1976d2",
                fontSize: 10,
                fontWeight: "bold",
                padding: 8,
              }}
            >
              Buy Now
            </Button>
          )}
        </Card>
      )}
    </>
  );
}
