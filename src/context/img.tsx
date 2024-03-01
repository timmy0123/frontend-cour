import * as React from "react";
import {
  Grid,
  Box,
  Stack,
  Button,
  Checkbox,
  Modal,
  Tooltip,
} from "@mui/material";
import Divider from "@mui/material/Divider";
import { getImg } from "../components/components-query/QueryComponent";
import { Imageurl } from "../interface/interface";
import StyledDropzone from "../components/dropZone";

require("dotenv").config();
const label = { inputProps: { "aria-label": "Checkbox demo" } };
const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

const FileUpload: React.FC = () => {
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  const [selectedFile, setSelectedFile] = React.useState<any>(null);
  const fileInputRef = React.useRef<any>(null);

  const handleFileChange = (event: any) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleButtonClick = () => {
    // Trigger file input click when the button is clicked
    fileInputRef!.current.click();
  };

  const handleFormSubmit = async (event: any) => {
    event.preventDefault();

    if (!selectedFile) {
      alert("Please select a file");
      return;
    }

    const formData = new FormData();
    formData.append("image", selectedFile);
    try {
      const response = await fetch(`${backendUrl}/UploadImg`, {
        method: "POST",
        body: formData,
      });

      // Handle response from the server
      console.log("Response:", response);
      window.location.reload();
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <form onSubmit={handleFormSubmit}>
      {/* Hidden file input */}
      <input
        id="fileupload"
        type="file"
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={handleFileChange}
      />

      {/* Button to trigger file input */}
      <button type="button" onClick={handleButtonClick}>
        Browse
      </button>

      {/* Display selected file name (optional) */}
      {selectedFile && <p>Selected file: {selectedFile.name}</p>}

      {/* Submit button */}
      <button type="submit">Upload</button>
    </form>
  );
};

const imgUpload: React.FC = () => {
  const [loading, setLoading] = React.useState<boolean>(true);
  const [imgurl, setimgurl] = React.useState<Imageurl[] | undefined>(undefined);
  const [selected, setselected] = React.useState<string[]>([]);
  const [openAdd, setopenAdd] = React.useState<boolean>(false);

  (async () => {
    if (loading) {
      const res = await getImg();
      if (res.length > 0) setimgurl(res);
      setLoading(false);
    }
  })();

  async function handleSelectImg() {
    let selectName = "";
    selected.forEach((value) => {
      selectName += `imgs=${value}&`;
    });
    selectName = selectName.substring(0, selectName.length - 1);
    await fetch(`${backendUrl}/SelectImg?${selectName}`, {
      method: "POST",
    });
    setselected([]);
    setimgurl([]);
    setLoading(true);
  }

  async function handleDeleteImg() {
    for (let i = 0; i < selected.length; i++) {
      let name = `filename=${selected[i]}`;
      await fetch(`${backendUrl}/DeleteImg?${name}`, {
        method: "Delete",
      });
    }
    setselected([]);
    setimgurl([]);
    setLoading(true);
  }

  return (
    <Stack width="100%" height="100vh" spacing={0} marginTop={5}>
      <Box
        paddingLeft={1}
        paddingRight={1}
        paddingBottom={0.5}
        height="5vh"
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
        }}
      >
        <Stack direction="row" spacing={0.5}>
          <Button variant="outlined" onClick={() => handleSelectImg()}>
            設為輪播圖
          </Button>
          <Button variant="outlined" onClick={() => handleDeleteImg()}>
            刪除
          </Button>
          <Button
            variant="outlined"
            onClick={() => {
              setopenAdd(true);
            }}
          >
            新增
          </Button>
          <Modal
            open={openAdd}
            onClose={() => {
              setopenAdd(false);
            }}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box className="addImg">
              <FileUpload />
            </Box>
          </Modal>
        </Stack>
      </Box>
      <Divider style={{ border: "1px solid gray" }} />
      <StyledDropzone>
        <Box paddingLeft={1} paddingRight={2} height="100%" width="95%">
          <Grid container spacing={{ xs: 0, md: 2 }} height="100%" width="95%">
            {!loading ? (
              imgurl ? (
                imgurl.map((url: Imageurl, index: number) => (
                  <Grid item xs={12} md={4} key={index}>
                    <Box
                      className="imgbox"
                      marginBottom={{ xs: 7, md: 3.5 }}
                      sx={{
                        border: 1,
                        borderRadius: 5,
                        borderColor: url.used ? "red" : "gray",
                      }}
                    >
                      <Stack spacing={1}>
                        <Grid
                          container
                          sx={{ display: "flex", alignItems: "center" }}
                        >
                          <Grid item md={2} lg={1}>
                            <Checkbox
                              id={`${index}`}
                              {...label}
                              onChange={(event) => {
                                const name = url.url.split("/").slice(-1)[0];
                                const index = selected.indexOf(name);
                                if (index > -1) {
                                  selected.splice(index, 1);
                                } else {
                                  selected.push(name);
                                }
                                setselected(selected);
                              }}
                            />
                          </Grid>
                          <Grid item md={10}>
                            <Box
                              sx={{
                                display: "flex",
                                justifyContent: "flex-start",
                              }}
                            >
                              <Tooltip title={url.url.split("/").slice(-1)[0]}>
                                <a
                                  style={{
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    whiteSpace: "nowrap",
                                  }}
                                >
                                  {url.url.split("/").slice(-1)[0]}
                                </a>
                              </Tooltip>
                            </Box>
                          </Grid>
                        </Grid>
                        <Divider />
                        <Box sx={{ display: "flex", justifyContent: "center" }}>
                          <img
                            src={url.url}
                            alt={url.url}
                            style={{
                              height: "95%",
                              width: "95%",
                              maxHeight: "330px",
                            }}
                          />
                        </Box>
                      </Stack>
                    </Box>
                  </Grid>
                ))
              ) : (
                <></>
              )
            ) : (
              <h3>Loading...</h3>
            )}
          </Grid>
        </Box>
      </StyledDropzone>
    </Stack>
  );
};

export default imgUpload;
