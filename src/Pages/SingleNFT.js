import React, { useState, useEffect } from "react";
import { Formik, Form, Field, FieldArray } from "formik";
import * as Yup from "yup";
import { Card, Grid } from "@mui/material";
import { _transction } from "../../src/CONTRACT-ABI/connect";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import TextareaAutosize from "@mui/material/TextareaAutosize";
import Switch from "@mui/material/Switch";
import DeleteOutlineIcon from "@mui/icons-material/Delete";
import { pink } from "@mui/material/colors";
import TransctionModal from "../components/shared/TransctionModal";
import HeaderWrapper from "../components/shared/BackgroundUI";
import { getSymbol } from "../utils/currencySymbol";
import "../styles/background.css";
import {
  uploadFileToIpfs,
  createAnduploadFileToIpfs,
} from "../utils/uploadFileToIpfs";
import swal from "sweetalert";
import { ConfigContext } from "../App";
import { convertEthToWei } from "../utils/web3Util";
import { addNftImageToDatabase } from "../functions/addNftImageToDatabase";
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';

const VendorSchema = Yup.object().shape({
  title: Yup.string().required("Title is required"),
  authorname: Yup.string().required("Authorname is required"),
  price: Yup.string().required("Price is required"),
  royelty: Yup.number().max(15),
});

const Mint = () => {
  const configs = React.useContext(ConfigContext);

  const [start, setStart] = useState(false);
  const [response, setResponse] = useState(null);
  const [file, setFile] = useState(null);
  const [selectedFile, setSelectedFile] = useState();
  const [preview, setPreview] = useState();
  const [checked, setChecked] = useState(false);


  const [deleteicon, setDeleteicon] = useState(false);
  const [title, setTitle] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [chooseCategory, setChooseCategory] = useState('');
  const [price, setPrice] = useState(0);
  const [description, setDescription] = useState(null);
  const [royelty, setRoyelty] = useState(0);
  const [attributesObj, setAttributesObj] = useState([]);
  const [attributeChecked, setAttributeChecked] = useState(false);

  const [attributeKey, setAttributeKey] = useState('');
  const [attributeValue, setAttributeValue] = useState('');



  const handleChange = (event) => {
    setChecked(event.target.checked);
  };
  const attributeCheckedHandler = () => {
    setAttributeChecked(!attributeChecked)
  };
  let history = useNavigate();

  const saveData = async () => {
    setStart(true);
    let responseData;
    let results;
    const dummyAttrribute = 
      {
        display_type: "date",
        trait_type: "publish-date",
        value: new Date(),
      }
    ;
    if (file) {
      const fileInput = document.querySelector('input[type="file"]');

      try {
        results = await uploadFileToIpfs(configs, fileInput.files);
      } catch (err) {
        swal({
          title: "Server issue!",
          text: "Upload File To Ipfs Failed, please try again",
          icon: "warning",
          buttons: true,
          dangerMode: true,
        }).then((willDelete) => {
          if (willDelete) {
            console.error("upload File To Ipfs Failed", err);
            setStart(false);
            return;
          }
        });
      }

      console.log("---results-->", results);

      const metaData = {
        name: title,
        author: authorName,
        category: chooseCategory,
        image: results,
        description: description,
        attributes: [...attributesObj,dummyAttrribute],
      };

      let resultsSaveMetaData;
      try {
        resultsSaveMetaData = await createAnduploadFileToIpfs(
          configs,
          metaData
        );
      } catch (err) {
        alert("upload File To Ipfs Failed, please try again");
        console.error("upload File To Ipfs Failed", err);
        setStart(false);
        return;
      }
      console.log("---metadta-->", resultsSaveMetaData);

      try {
        responseData = await _transction(
          "mintNFT",
          resultsSaveMetaData,
          convertEthToWei(price),
          royelty,
          chooseCategory
        );
      } catch (err) {
        swal({
          title: "Server issue!",
          text: "Mint NFT failed Failed, please try again",
          icon: "warning",
          buttons: true,
          dangerMode: true,
        }).then((willDelete) => {
          if (willDelete) {
            console.error("Mint NFT failed Failed", err);
            setStart(false);
            return;
          }
        });
      }
    }
    // ---------------------------------------------------------------------------
    if (responseData?.events?.Transfer?.returnValues?.tokenId) {
      console.log("______data_added_to_metaverse_______");
      // await addNftImageToDatabase(category, responseData, results);
    }
    // ---------------------------------------------------------------------------
    setResponse(responseData);
  };

  useEffect(() => {
    if (!selectedFile) {
      setPreview(undefined);
      return;
    }
    const objectUrl = URL.createObjectURL(selectedFile);
    setPreview(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedFile]);

  const onFileChange = (event) => {
    setFile(event.target.files[0]);
    setSelectedFile(event.target.files[0]);
  };

  const modalClose = () => {
    setStart(false);
    setResponse(null);
    history("/");
  };
  return (
    <>
      {start && <TransctionModal response={response} modalClose={modalClose} />}
      <HeaderWrapper className="header-wrapper-form">
        <div className="form-layer2">
          <Grid container columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
            <Grid item lg={3} md={3} sm={12} xs={12}></Grid>
            <Grid item lg={6} md={6} sm={12} xs={12}>
              <div style={{ margin: 20 }}>
                <Card
                  style={{
                    background: "#ffffff9e",
                  }}
                >
                  <Grid container>
                    <Grid item lg={12} md={12} sm={12} xs={12}>
                      <div
                        style={{
                          padding: "20px",
                        }}
                      >
                        <h4>Create NFT</h4>
                        <Grid container>
                          <Grid item lg={6} md={6} sm={12} xs={12}>
                            <Grid item lg={6} md={6} sm={12} xs={12}>
                              <div
                                className="form-group"
                                style={{ marginLeft: 10, marginTop: 10 }}
                              >
                                <label for="title" className="my-2">
                                  Title{" "}
                                  <span className="text-danger">*</span>
                                </label>

                              </div>
                            </Grid>
                            <Grid item lg={6} md={6} sm={12} xs={12}>
                              <TextField
                                style={{ marginRight: 10, padding: 9, width: 325 }}
                                type="text"
                                name="title"
                                placeholder="Enter title"
                                size="small"
                                variant="outlined"
                                onChange={(e) => {
                                  setTitle(e.target.value)
                                }
                                }
                              />
                            </Grid>

                          </Grid>


                          <Grid item lg={6} md={6} sm={12} xs={12}>
                            <Grid item lg={6} md={6} sm={12} xs={12}>
                              <div
                                className="form-group"
                                style={{ marginLeft: 10, marginTop: 10 }}
                              >
                                <label for="title" className="my-2">
                                  Author Name{" "}
                                  <span className="text-danger">*</span>
                                </label>

                              </div>
                            </Grid>
                            <Grid item lg={6} md={6} sm={12} xs={12}>
                              <TextField
                                style={{ marginRight: 10, padding: 9, width: 325 }}
                                type="text"
                                name="authorname"
                                placeholder="Enter Author name"
                                size="small"
                                variant="outlined"
                                onChange={(e) => {
                                  setAuthorName(e.target.value)
                                }
                                }
                              />
                            </Grid>
                          </Grid>

                          <Grid item lg={6} md={6} sm={12} xs={12}>
                            <Grid item lg={6} md={6} sm={12} xs={12}>
                              <div
                                className="form-group"
                                style={{ marginLeft: 10, marginTop: 10 }}
                              >
                                <label for="title" className="my-2">
                                  Price{" "}
                                  <span className="text-danger">*</span>
                                </label>

                              </div>
                            </Grid>
                            <Grid item lg={6} md={6} sm={12} xs={12}>
                              <TextField
                                style={{ marginRight: 10, padding: 9, width: 325 }}
                                type="number"
                                name="price"
                                placeholder={`Enter price in ${getSymbol()}`}
                                size="small"
                                variant="outlined"
                                onChange={(e) => {
                                  setPrice(e.target.value)
                                }
                                }
                              />
                            </Grid>

                          </Grid>

                          <Grid item lg={6} md={6} sm={12} xs={12}>
                            <Grid item lg={6} md={6} sm={12} xs={12}>
                              <div
                                className="form-group"
                                style={{ marginLeft: 10, marginTop: 10 }}
                              >
                                <label for="title" className="my-2">
                                  Choose category{" "}
                                  <span className="text-danger">*</span>
                                </label>
                              </div>
                            </Grid>
                            <Grid item lg={6} md={6} sm={12} xs={12}>
                              <Select
                                labelId="demo-select-small"
                                id="demo-select-small"
                                name="category"
                                style={{ marginLeft: 10, marginTop: 10, padding: 9, height: 40, width: 310 }}
                                onChange={(e) => {
                                  setChooseCategory(e.target.value)
                                }
                                }
                              >
                                <MenuItem >-- Please select --</MenuItem>
                                <MenuItem value={'art'}>Art</MenuItem>
                                <MenuItem value={'music'}>Music</MenuItem>
                                <MenuItem value={'sports'}>Sports</MenuItem>
                              </Select>
                            </Grid>

                          </Grid>

                          <Grid item lg={12} md={12} sm={12} xs={12}>
                            <div
                              className="form-group"
                              style={{ marginLeft: 10, marginTop: 10 }}
                            >
                              <label for="title" className="my-2">
                                Choose file{" "}
                                <span className="text-danger">*</span>
                              </label>

                              <input
                               style={{ backgroundColor : '#f4f3f0'}}
                                className={`form-control text-muted`}
                                type="file"
                                onChange={onFileChange}
                              />

                              {selectedFile && (
                                <center>
                                  <img
                                    src={preview}
                                    alt="img"
                                    style={{
                                      marginTop: 20,
                                      height: 300,
                                      width: "auto",
                                    }}
                                  />
                                </center>
                              )}
                            </div>
                          </Grid>

                          <Grid item lg={12} md={12} sm={12} xs={12}>
                            <div
                              className="form-group"
                              style={{ marginLeft: 10, marginTop: 10 }}
                            >
                              <label for="title" className="my-2">
                                Description{" "}
                                <span className="text-danger">*</span>
                              </label>
                              <TextareaAutosize
                                aria-label="minimum height"
                                minRows={3}
                                name="text"
                                onChange={(e) =>
                                  setDescription(e.target.value)
                                }
                                placeholder="Minimum 3 rows"
                                style={{ width: "100%", padding: 9 , backgroundColor : '#f4f3f0'}}

                              />
                            </div>
                          </Grid>

                          <Grid item lg={6} md={6} sm={12} xs={12}>
                            <Grid item lg={6} md={6} sm={12} xs={12}>
                              <div
                                className="form-group"
                                style={{ marginLeft: 10, marginTop: 10 }}
                              >
                                <label for="title" className="my-2">
                                  Royalty amount{" "}
                                </label>
                                <div style={{ float: "right" }}>
                                  <Switch
                                    checked={checked}
                                    onChange={handleChange}
                                    inputProps={{
                                      "aria-label": "controlled",
                                    }}
                                  />
                                </div>

                              </div>
                            </Grid>
                            <Grid item lg={6} md={6} sm={12} xs={12}>
                              {checked && (
                                <TextField
                                  style={{ marginRight: 10, padding: 9, width: 325 }}
                                  type="number"
                                  name="royelty"
                                  placeholder="Enter royalty amount (%)"
                                  size="small"
                                  variant="outlined"
                                  onChange={(e) =>
                                    setRoyelty(e.target.value)
                                  }
                                />
                              )}
                            </Grid>
                          </Grid>



                          <Grid item lg={12} md={12} sm={12} xs={12} style={{ marginLeft: 10, marginTop: 10 }}>
                              <span >
                                <Button
                                  variant="outlined"
                                  size="medium"
                                  type="button"
                                  onClick={attributeCheckedHandler}
                                >
                                  {/* show this when user has removed all attributes from the list */}
                                  Add attributes
                                </Button>
                              </span>
                              {attributeChecked &&
                              <div
                                style={{
                                  border: "1px solid #c7c9cc",
                                  borderRadius: 5,
                                  padding: 12,
                                  marginTop: 15,
                                }}>
                                <Grid container>
                                  <Grid item lg={5} md={5} sm={12} xs={12}
                                    style={{
                                      marginRight: 20,
                                    }}
                                  >
                                    <TextField
                                      style={{ marginRight: 10, padding: 9, width: 325, marginTop: 10, }}
                                      placeholder={'add atribute title'}
                                      value={attributeKey}
                                      size="small"
                                      variant="outlined"
                                      onChange={(e) => setAttributeKey(e.target.value)}
                                    />
                                  </Grid>
                                  <Grid item lg={6} md={6} sm={12} xs={12} >
                                    <TextField
                                      style={{ marginRight: 10, padding: 9, width: 325, marginTop: 10, }}
                                      placeholder={'add atribute value'}
                                      value={attributeValue}
                                      size="small"
                                      variant="outlined"
                                      onChange={(e) => setAttributeValue(e.target.value)}
                                    />
                                  </Grid>
                                  <Grid item lg={6} md={6} sm={12} xs={12} >
                                    <Button
                                      style={{ marginLeft: 10, padding: 9, marginTop: 10, }}
                                      variant="outlined"
                                      size="medium"
                                      type="button"
                                      onClick={() => {
                                        setAttributesObj([{ trait_type : attributeKey, value : attributeValue }, ...attributesObj])
                                        setAttributeKey(null)
                                        setAttributeValue(null)
                                      }}>
                                      + Add
                                    </Button>
                                  </Grid>

                                  {attributesObj.map(
                                    (attribut, index) => (
                                      attribut && (
                                        <div
                                          style={{
                                            marginTop: 5,
                                          }}
                                          key={index}
                                        >

                                          <Grid container>
                                            <Grid
                                              item
                                              lg={5}
                                              md={5}
                                              sm={12}
                                              xs={12}
                                              style={{
                                                marginRight: 20,
                                              }}
                                            >
                                              <TextField
                                                style={{ marginRight: 10, padding: 9, width: 325, marginTop: 10, }}
                                                // placeholder={'add atribute title'}
                                                value={attribut.trait_type}
                                                size="small"
                                                variant="outlined"
                                              />
                                            </Grid>
                                            <Grid
                                              item
                                              lg={6}
                                              md={6}
                                              sm={12}
                                              xs={12}
                                            >
                                              <TextField
                                                style={{ marginRight: 10, padding: 9, width: 325, marginTop: 10, }}
                                                // placeholder={'add atribute value'}
                                                value={attribut.value}
                                                size="small"
                                                variant="outlined"
                                              />
                                            </Grid>
                                            <DeleteOutlineIcon
                                              onClick={() => {
                                                attributesObj[index] = null
                                                setDeleteicon(!deleteicon)
                                              }
                                              }
                                              sx={{ color: pink[500] }}
                                              style={{
                                                marginTop: 25,
                                                float: "right",
                                                cursor: "pointer",
                                              }}
                                            />
                                          </Grid>

                                        </div>
                                      )
                                    )
                                  )}

                                </Grid>
                              </div>
                            }
                            <div
                              className="form-group"
                              style={{ marginLeft: 10, marginTop: 10 }}
                            >
                              <div>

                              </div>
                            </div>
                          </Grid>

                          <Grid item lg={12} md={12} sm={12} xs={12}>
                            <div
                              className="form-group"
                              style={{
                                marginLeft: 10,
                                marginTop: 10,
                                float: "right",
                              }}
                            >
                              <span className="input-group-btn">
                                <Button
                                  variant="contained"
                                  size="large"
                                  sx={{
                                    marginX: "15px",
                                    marginBottom: "15px",
                                  }}
                                  onClick={() => {
                                    saveData();
                                  }}
                                  style={{
                                    fontSize: 16,
                                    padding: "10px 24px",
                                    borderRadius: 12,
                                  }}
                                >
                                  Create
                                </Button>
                              </span>
                            </div>
                          </Grid>

                        </Grid>
                      </div>
                    </Grid>
                  </Grid>
                </Card>
              </div>
            </Grid>
            <Grid item lg={3} md={3} sm={12} xs={12}></Grid>
          </Grid>
        </div>
      </HeaderWrapper>
    </>
  );
};
export default Mint;
