import * as React from "react";
import { useState } from "react";
import {
  Grid,
  Box,
  Stack,
  Button,
  Checkbox,
  Modal,
  TextField,
  IconButton,
} from "@mui/material";
import {
  DataGrid,
  GridColDef,
  GridValueGetterParams,
  viVN,
} from "@mui/x-data-grid";
import { Typography, ThemeProvider } from "@material-ui/core";
import Divider from "@mui/material/Divider";
import { AbsList } from "../interface/interface";
import { getAbs, getItem } from "../components/components-query/QueryComponent";
import theme from "@/styles/font";
import { City } from "../components/components-Taiwan/discCity";
import { rowtype } from "../interface/interface";
import CloseIcon from "@mui/icons-material/Close";
import Image from "next/image";

require("dotenv").config();
const label = { inputProps: { "aria-label": "Checkbox demo" } };
const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

const AbsUpload: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [items, setitems] = useState<AbsList[] | undefined>(undefined);
  const [selectedTitle, setselectedTitle] = useState<string[]>([]);
  const [selectedImgName, setselectedImgName] = useState<string[]>([]);
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [openAdd, setopenAdd] = useState<boolean>(false);
  const [openEdited, setopenEdited] = useState<boolean>(false);
  const [editedTitle, seteditedTitle] = useState<string>("");
  const [editedSubtitle, seteditedSubtitle] = useState<string>("");
  const [editedDesc, seteditedDesc] = useState<string>("");
  const [editedId, seteditedId] = useState<string>("");
  const [editedurl, seteditedurl] = useState<string>("");
  const [existFile, setexistFile] = useState<string>("");

  (async () => {
    if (loading) {
      const res = await getAbs();
      if (res.length > 0) setitems(res);
      setLoading(false);
    }
  })();

  async function handleDeleteItem() {
    for (let i = 0; i < selectedTitle.length; i++) {
      let Imgname = `fileName=${selectedImgName[i]}`;
      let title = `title=${selectedTitle[i]}`;
      await fetch(`${backendUrl}/DeleteAbs?${Imgname}&${title}`, {
        method: "Delete",
      });
    }
    setitems([]);
    setselectedTitle([]);
    setselectedImgName([]);
    setLoading(true);
  }

  async function handleSaveItem() {
    if (!selectedFile && openEdited) {
      let id = `id=${editedId}`;
      const title = `title=${editedTitle}`;
      const subtitle = `subtitle=${editedSubtitle}`;
      let fromData = new FormData();

      fromData.append("description", editedDesc);
      await fetch(`${backendUrl}/EditAbs?${id}&${title}&${subtitle}`, {
        method: "Post",
        body: fromData,
      });
      seteditedDesc("");
      seteditedId("");
      seteditedSubtitle("");
      seteditedId("");
      seteditedTitle("");
      setSelectedFile(null);
      setexistFile("");
      seteditedurl("");
      setopenAdd(false);
      setopenEdited(false);
      setitems([]);
      setLoading(true);
    } else {
      if (openEdited) {
        let Imgname = `fileName=${existFile}`;
        let title = `title=${editedTitle}`;
        await fetch(`${backendUrl}/DeleteAbs?${Imgname}&${title}`, {
          method: "Delete",
        });
      }
      const title = `title=${editedTitle}`;
      const subtitle = `subtitle=${editedSubtitle}`;

      let fromData = new FormData();

      fromData.append("image", selectedFile!);
      fromData.append("description", editedDesc);
      await fetch(`${backendUrl}/UploadAbs?&${title}&${subtitle}`, {
        method: "Post",
        body: fromData,
      });
      seteditedDesc("");
      seteditedId("");
      seteditedSubtitle("");
      seteditedId("");
      seteditedTitle("");
      setSelectedFile(null);
      setexistFile("");
      seteditedurl("");
      setopenAdd(false);
      setopenEdited(false);
      setitems([]);
      setLoading(true);
    }
  }
  const handleFileChange = (event: any) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleButtonClick = () => {
    // Trigger file input click when the button is clicked
    fileInputRef!.current!.click();
  };

  return (
    <ThemeProvider theme={theme}>
      <Stack width="100%" height="100vh" spacing={1} marginTop={5}>
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
            <Button variant="outlined" onClick={handleDeleteItem}>
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
              <Box className="addImg"></Box>
            </Modal>
          </Stack>
        </Box>
        <Divider style={{ border: "1px solid gray" }} />
        <Box
          paddingLeft={1}
          paddingRight={10}
          paddingBottom={7}
          sx={{
            overflowY: "scroll",
            width: "96%",
            height: "95%",
          }}
        >
          <Grid container spacing={2}>
            {!loading ? (
              items ? (
                items.map((Item: AbsList, index: number) => (
                  <Grid item xs={12} key={index}>
                    <Box
                      className="itembox"
                      sx={{
                        border: 1,
                        borderRadius: 5,
                        borderColor: "gray",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <Grid container paddingLeft={0.5}>
                        <Grid
                          item
                          xs={1.2}
                          md={0.6}
                          lg={0.4}
                          sx={{ display: "flex", alignItems: "center" }}
                        >
                          <Checkbox
                            {...label}
                            id={Item.title}
                            onChange={(event) => {
                              const imgName = Item.pictureUrl
                                .split("/")
                                .slice(-1)[0];
                              const index = selectedTitle.indexOf(Item.title);

                              if (index > -1) {
                                selectedTitle.splice(index, 1);
                                selectedImgName.splice(index, 1);
                              } else {
                                selectedTitle.push(Item.title);
                                selectedImgName.push(imgName);
                              }
                              setselectedTitle(selectedTitle);
                              setselectedImgName(selectedImgName);
                            }}
                          />
                        </Grid>
                        <Grid
                          item
                          md={3}
                          sx={{
                            cursor: "pointer",
                            display: { xs: "none", md: "flex" },
                            alignItems: "center",
                          }}
                          onClick={() => {
                            seteditedDesc(Item.Description);
                            seteditedId(Item.id);
                            seteditedSubtitle(Item.subtitle);
                            seteditedId(Item.id);
                            seteditedTitle(Item.title);
                            setexistFile(
                              Item.pictureUrl.split("/").slice(-1)[0]
                            );
                            seteditedurl(Item.pictureUrl);
                            setopenEdited(true);
                          }}
                        >
                          <Image
                            title={Item.pictureUrl.split("/").slice(-1)[0]}
                            alt={Item.pictureUrl.split("/").slice(-1)[0]}
                            src={Item.pictureUrl}
                            style={{
                              height: "95%",
                              width: "95%",
                              maxHeight: "240px",
                            }}
                          />
                        </Grid>
                        <Grid
                          item
                          xs={10.3}
                          md={8}
                          lg={8}
                          paddingTop={1}
                          sx={{
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "flex-start",
                          }}
                          onClick={() => {
                            seteditedDesc(Item.Description);
                            seteditedId(Item.id);
                            seteditedSubtitle(Item.subtitle);
                            seteditedId(Item.id);
                            setexistFile(
                              Item.pictureUrl.split("/").slice(-1)[0]
                            );
                            seteditedTitle(Item.title);
                            seteditedurl(Item.pictureUrl);
                            setopenEdited(true);
                          }}
                        >
                          <Stack
                            spacing={0.2}
                            width="100%"
                            height="100%"
                            maxHeight="240px"
                          >
                            <Typography variant="h3">{Item.title}</Typography>
                            <Divider style={{ border: "1px solid gray" }} />
                            <Typography variant="h4">
                              {Item.subtitle}
                            </Typography>
                            <TextField
                              disabled
                              defaultValue={Item.Description}
                              multiline
                              rows={5}
                            />
                          </Stack>
                        </Grid>
                      </Grid>
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
      <Modal
        open={openAdd || openEdited}
        onClose={() => {
          seteditedDesc("");
          seteditedId("");
          seteditedSubtitle("");
          seteditedId("");
          setexistFile("");
          seteditedTitle("");
          seteditedurl("");
          setexistFile("");
          setopenAdd(false);
          setopenEdited(false);
        }}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box className="addItem">
          <Box
            marginTop={2}
            marginLeft={2}
            sx={{
              overflowY: "scroll",
              width: "100%",
              height: "95%",
            }}
          >
            <Grid container spacing={1}>
              <Grid item xs={8.25} sm={9.25} lg={9.75} />
              <Grid item xs={1} marginRight={3} marginTop={1}>
                <Box
                  width="100%"
                  height="100%"
                  sx={{ display: "flex", justifyContent: "flex-end" }}
                >
                  <Button variant="outlined" onClick={handleSaveItem}>
                    儲存
                  </Button>
                </Box>
              </Grid>
              <Grid
                item
                xs={1}
                lg={0.5}
                sx={{ display: "flex", alignItems: "center" }}
              >
                <IconButton
                  onClick={() => {
                    setopenAdd(false);
                    setopenEdited(false);
                  }}
                >
                  <CloseIcon />
                </IconButton>
              </Grid>
              <Grid
                item
                xs={12}
                md={1.25}
                sx={{ display: "flex", alignItems: "center" }}
              >
                <Typography variant="h4">標題</Typography>
              </Grid>
              <Grid item xs={11.4} md={10}>
                <TextField
                  required
                  id="outlined-required"
                  fullWidth
                  defaultValue={editedTitle}
                  onChange={(event) => {
                    seteditedTitle(event.target.value as string);
                  }}
                />
              </Grid>
              <Grid item xs={12} md={0.75} />
              <Grid
                item
                xs={12}
                md={1.25}
                sx={{ display: "flex", alignItems: "center" }}
              >
                <Typography variant="h4">副標題</Typography>
              </Grid>
              <Grid item xs={11.4} md={10}>
                <TextField
                  required
                  id="outlined-required"
                  fullWidth
                  defaultValue={editedSubtitle}
                  onChange={(event) => {
                    seteditedSubtitle(event.target.value as string);
                  }}
                />
              </Grid>
              <Grid item xs={12} md={0.75} />
              <Grid
                item
                md={1.25}
                sx={{ display: "flex", alignItems: "flex-start" }}
              >
                <Typography variant="h4">介紹</Typography>
              </Grid>
              <Grid item xs={11.4} md={10}>
                <TextField
                  id="outlined-multiline-flexible"
                  label=""
                  multiline
                  fullWidth
                  rows={40}
                  defaultValue={editedDesc}
                  onChange={(event) => {
                    seteditedDesc(event.target.value as string);
                  }}
                />
              </Grid>
              <Grid item xs={12} md={0.75} />
              <Grid item xs={12} md={12} marginY={3} marginRight={3}>
                <Divider style={{ border: "1px solid gray" }} />
              </Grid>
              <Grid
                item
                xs={12}
                md={1.25}
                sx={{ display: "flex", alignItems: "center" }}
              >
                <Typography variant="h4">圖片</Typography>
              </Grid>
              <Grid item xs={8.5} md={7.5} lg={7.5}>
                <TextField
                  required
                  id="outlined-required"
                  fullWidth
                  disabled
                  value={selectedFile ? selectedFile.name : ""}
                />
              </Grid>
              <Grid item xs={3} md={2.5} letterSpacing={1}>
                <Box
                  width="100%"
                  height="100%"
                  sx={{ display: "flex", justifyContent: "flex-end" }}
                >
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleButtonClick()}
                  >
                    browse file
                  </Button>

                  <input
                    id="img-select"
                    type="file"
                    ref={fileInputRef}
                    style={{ display: "none" }}
                    onChange={handleFileChange}
                  />
                </Box>
              </Grid>
              <Grid item xs={12} marginY={3} marginRight={3}>
                <Divider style={{ border: "1px solid gray" }} />
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Modal>
    </ThemeProvider>
  );
};

export default AbsUpload;
