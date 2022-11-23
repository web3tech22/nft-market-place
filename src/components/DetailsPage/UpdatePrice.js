import React, { useState } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { Grid, Card } from "@mui/material";
import { _transction } from "../../CONTRACT-ABI/connect";
import TransctionModal from "../shared/TransctionModal";
import { getSymbol } from "../../utils/currencySymbol";
import { convertEthToWei, convertEthFromWei } from "../../utils/web3Util";

const VendorSchema = Yup.object().shape({
  amount: Yup.string().required("Amount is required"),
});

const UpdatePrice = ({ price, tokenId, fetchNftInfo }) => {
  const [start, setStart] = useState(false);
  const [response, setResponse] = useState(null);

  const saveData = async ({ amount }) => {
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
          <Formik
            initialValues={{
              amount: convertEthFromWei(price),
            }}
            validationSchema={VendorSchema}
            onSubmit={(values, { setSubmitting }) => {
              saveData(values);
              setSubmitting(false);
            }}
          >
            {({ touched, errors, isSubmitting, values }) => (
              <Form>
                <div className="form-group">
                  <Field
                    type="text"
                    name="amount"
                    autoComplete="flase"
                    placeholder={`Enter amount (${getSymbol()})`}
                    className={`form-control text-muted ${
                      touched.amount && errors.amount ? "is-invalid" : ""
                    }`}
                    style={{ marginRight: 10, padding: 6 }}
                  />
                </div>

                <div className="form-group" style={{ marginTop: 20 }}>
                  <span className="input-group-btn">
                    <input
                      className="btn btn-default btn-primary"
                      type="submit"
                      value={"Update"}
                    />
                  </span>
                </div>
              </Form>
            )}
          </Formik>
        </Card>
      </div>
    </>
  );
};
export default UpdatePrice;
