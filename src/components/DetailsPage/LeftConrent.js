import React from "react";
import {
  Grid,
  Link,
  Typography,
  Card,
  CardMedia,
  CardContent,
  CardHeader,
  Tooltip,
} from "@mui/material";
import { makeStyles } from "@material-ui/core/styles";
import MarkAsFevourite from "../shared/MarkAsFevourite";
import RedirectToOpenSea from "../shared/RedirectToOpenSea";
import { currentNeteork } from "../../utils/currentNeteork";
import { networkURL } from "../../config";
import { get_url_extension, allowableVideoFormat } from "../../utils/fileInfo";
import imgNotFound from "../../assets/images/default-placeholder.png";
import { ConfigContext } from "../../App";
const DetailsHead = [
  "Contract Address:",
  "Token ID:",
  "Token Standard:",
  "BlockChain:",
];

const useStyles = makeStyles({
  image: {
    minWidth: 100,
    minHeight: 100,
    borderRadius: "30px",
    maxHeight: 577,
    padding: 20,
  },
});

export default function LeftConrent({ nftData, tokenId, ContractAddress }) {
  const configs = React.useContext(ConfigContext);
  const { description, image } = nftData;
  const classes = useStyles();

  return (
    <Card
      sx={{
        border: "0.01px solid rgba(0, 0, 0, 0.09)",
      }}
    >
      <CardHeader
        title={
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <MarkAsFevourite tokenId={tokenId} />

            <RedirectToOpenSea tokenId={tokenId} />
          </div>
        }
      ></CardHeader>

      {allowableVideoFormat.includes(get_url_extension(image)) ? (
        <video width="500" controls>
          <source src={image} type="video/mp4" />
          <source src={image} type="video/ogg" />
          Your browser does not support HTML video.
        </video>
      ) : (
        <CardMedia
          className={classes.image}
          component="img"
          image={image}
          alt="Loading"
          height="370"
          width="100%"
          sx={{ backgroundSize: "cover" }}
          onError={(e) => {
            e.currentTarget.src = imgNotFound;
          }}
        />
      )}

      <CardContent sx={{ pl: 3 }}>
        <Typography
          variant="subtitle1"
          component="div"
          fontWeight="bold"
          gutterBottom
        >
          Description
        </Typography>

        <Typography variant="subtitle2" paragraph marginBottom="30px">
          {description}
        </Typography>
        <Grid container spacing={1} marginX="1px">
          <Grid xs={5}>
            {DetailsHead.map((heading) => (
              <Typography
                variant="body2"
                paragraph
                item
                key={heading}
                fontWeight="600"
              >
                {heading}
              </Typography>
            ))}
          </Grid>
          <Grid xs={7}>
            <Tooltip title="Contrct Address">
              <Link
                href={`${networkURL(configs)}/address/${ContractAddress}`}
                target="_blank"
                sx={{ textDecoration: "none" }}
              >
                <Typography
                  variant="body2"
                  paragraph
                  item
                  fontWeight="600"
                  sx={{
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    width: "11rem",
                  }}
                >
                  {ContractAddress}
                </Typography>
              </Link>
            </Tooltip>
            <Tooltip title="Author Name">
              <Typography
                variant="body2"
                paragraph
                item
                fontWeight="600"
                sx={{
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  width: "11rem",
                }}
              >
                #{tokenId}
              </Typography>
            </Tooltip>
            <Typography variant="body2" paragraph item fontWeight="600">
              ERC-721
            </Typography>
            <Typography variant="body2" paragraph item fontWeight="600">
              {currentNeteork()}
            </Typography>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}
