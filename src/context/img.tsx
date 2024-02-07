import * as React from "react";
import { Grid, Box, Stack, Button, Checkbox } from "@mui/material";
import Divider from "@mui/material/Divider";
import { getImg } from "../components/components-getImg/ImgComponent";
import { Imageurl } from "../interface/interface";

require("dotenv").config();
const label = { inputProps: { "aria-label": "Checkbox demo" } };

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
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <form onSubmit={handleFormSubmit}>
      {/* Hidden file input */}
      <input
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
  const [selectused, setselectused] = React.useState<boolean>(false);
  const [selectdelete, setselectdelete] = React.useState<boolean>(false);

  (async () => {
    const res = await getImg();
    if (res.length > 0) setimgurl(res);
    setLoading(false);
  })();

  return (
    <Stack width="100%" height="100%" spacing={2} marginTop={5}>
      <Box paddingLeft={2} paddingRight={2}>
        <a>ff</a>
      </Box>
      <Divider style={{ border: "1px solid gray" }} />
      <Box
        sx={{ overflowY: "scroll", height: "100%", width: "100%" }}
        paddingLeft={2}
        paddingRight={2}
      >
        <Grid container spacing={2}>
          {!loading ? (
            imgurl ? (
              imgurl.map((url: Imageurl, index: number) => (
                <Grid item xs={12} md={4}>
                  <Box
                    className="imgbox"
                    sx={{
                      backgroundColor: url.used ? "gray" : "none",
                      border: 1,
                      borderRadius: 5,
                    }}
                  >
                    <Stack spacing={1}>
                      <Grid
                        container
                        sx={{ display: "flex", alignItems: "center" }}
                      >
                        <Grid item md={1}>
                          <Checkbox {...label} disabled />
                        </Grid>
                        <Grid item md={10}>
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "flex-start",
                            }}
                          >
                            <a>{url.url.split("/").slice(-1)[0]}</a>
                          </Box>
                        </Grid>
                      </Grid>
                      <Divider />
                      <Box
                        sx={{ display: "flex", justifyContent: "center" }}
                        paddingLeft={1.4}
                      >
                        <img
                          src={url.url}
                          style={{ height: "330px", width: "auto" }}
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
    </Stack>
  );
};

export default imgUpload;
