export const addNftImageToDatabase = async (
  category,
  responseData,
  results
) => {
  var formdata = new FormData();
  formdata.append("category", category);
  formdata.append(
    "token_id",
    responseData?.events?.Transfer?.returnValues?.tokenId
  );
  formdata.append("image_link", results);

  var requestOptions = {
    method: "POST",
    body: formdata,
    redirect: "follow",
  };

  return fetch(
    "https://sosal.in/endpoints/metaverce/add_nft.php",
    requestOptions
  )
    .then((response) => response.text())
    .then((result) => result)
    .catch((error) => error);
};
