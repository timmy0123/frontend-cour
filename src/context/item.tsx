import * as React from "react";
import {
  Grid,
  Box,
  Stack,
  Button,
  Checkbox,
  Modal,
  TextField,
  Input,
  Select,
  SelectChangeEvent,
  MenuItem,
} from "@mui/material";
import {
  DataGrid,
  GridColDef,
  GridValueGetterParams,
  viVN,
} from "@mui/x-data-grid";
import { Typography, ThemeProvider } from "@material-ui/core";
import Divider from "@mui/material/Divider";
import { ItemList } from "../interface/interface";
import { getItem } from "../components/components-query/QueryComponent";
import theme from "@/styles/font";
import { City } from "../components/components-Taiwan/discCity";
import { rowtype } from "../interface/interface";

require("dotenv").config();
const label = { inputProps: { "aria-label": "Checkbox demo" } };
const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

const ItemUpload: React.FC = () => {
  const [loading, setLoading] = React.useState<boolean>(true);
  const [items, setitems] = React.useState<ItemList[] | undefined>(undefined);
  const [selected, setselected] = React.useState<string[]>([]);
  const [openAdd, setopenAdd] = React.useState<boolean>(false);
  const [openEdited, setopenEdited] = React.useState<boolean>(false);
  const [editedTitle, seteditedTitle] = React.useState<string>("");
  const [itemName, setitemName] = React.useState<string>("");
  const [editedSubtitle, seteditedSubtitle] = React.useState<string>("");
  const [editedDesc, seteditedDesc] = React.useState<string>("");
  const [editedId, seteditedId] = React.useState<string>("");
  const [editedurl, seteditedurl] = React.useState<string>("");
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);
  const [selectcity, setselectcity] = React.useState<string>("臺北市");
  const [selectdist, setselectdist] = React.useState<string>("中正區");
  const cities = Object.keys(City);
  const [row, setrow] = React.useState<rowtype[]>([]);
  const [rowName, setrowName] = React.useState<string[]>([]);
  const columns: GridColDef[] = [
    {
      field: "id",
      headerName: "id",
      width: 20,
      editable: false,
    },
    {
      field: "City",
      headerName: "城市",
      width: 250,
      editable: false,
    },
    {
      field: "District",
      headerName: "行政區",
      width: 250,
      editable: false,
    },
    {
      field: "Address",
      headerName: "地址",
      width: 510,
      editable: false,
    },
  ];

  const handleSelectCityChange = (event: SelectChangeEvent) => {
    setselectcity(event.target.value as string);
  };

  const handleSelectDistrictChange = (event: SelectChangeEvent) => {
    setselectdist(event.target.value as string);
  };

  const handleFileChange = (event: any) => {
    console.log(event.target.files[0]);
    setSelectedFile(event.target.files[0]);
    console.log(selectedFile);
  };

  const handleButtonClick = () => {
    // Trigger file input click when the button is clicked
    fileInputRef!.current!.click();
  };

  (async () => {
    const res = await getItem();
    if (res.length > 0) setitems(res);
    setLoading(false);
  })();

  async function handleDeleteImg() {
    for (let i = 0; i < selected.length; i++) {
      let name = `filename=${selected[i]}`;
      await fetch(`${backendUrl}/DeleteImg?${name}`, {
        method: "Delete",
      });
    }
    setselected([]);
  }

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
              <Box className="addImg"></Box>
            </Modal>
          </Stack>
        </Box>
        <Divider style={{ border: "1px solid gray" }} />
        <Box paddingLeft={1} paddingRight={2}>
          <Grid container spacing={2}>
            {!loading ? (
              items ? (
                items.map((Item: ItemList, index: number) => (
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
                          md={0.4}
                          sx={{ display: "flex", alignItems: "center" }}
                        >
                          <Checkbox
                            {...label}
                            onChange={(event) => {
                              const name = Item.itemName;
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
                        <Grid
                          item
                          md={3}
                          sx={{
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                          }}
                          onClick={() => {
                            seteditedDesc(Item.itemDescription);
                            setitemName(Item.itemName);
                            seteditedId(Item.id);
                            seteditedSubtitle(Item.subtitle);
                            seteditedTitle(Item.title);
                            seteditedurl(Item.pictureUrl);
                            setopenEdited(true);
                          }}
                        >
                          <img
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
                          md={8.5}
                          paddingTop={1}
                          sx={{
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "flex-start",
                          }}
                          onClick={() => {
                            seteditedDesc(Item.itemDescription);
                            seteditedId(Item.id);
                            setitemName(Item.itemName);
                            seteditedSubtitle(Item.subtitle);
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
                            <Typography variant="h3">
                              {Item.itemName}
                            </Typography>
                            <Divider style={{ border: "1px solid gray" }} />
                            <Typography variant="h4">{Item.title}</Typography>
                            <Typography variant="h5">
                              {Item.subtitle}
                            </Typography>
                            <Typography variant="body1">
                              {Item.itemDescription}
                            </Typography>
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
          setitemName("");
          seteditedTitle("");
          seteditedurl("");
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
              <Grid md={10.25} />
              <Grid md={1} marginRight={3} marginTop={1}>
                <Box
                  width="100%"
                  height="100%"
                  sx={{ display: "flex", justifyContent: "flex-end" }}
                >
                  <Button variant="outlined">儲存</Button>
                </Box>
              </Grid>
              <Grid
                item
                md={1.25}
                sx={{ display: "flex", alignItems: "center" }}
              >
                <Typography variant="h4">商品名稱</Typography>
              </Grid>
              <Grid item md={10}>
                <TextField
                  required
                  id="outlined-required"
                  label="Required"
                  fullWidth
                  defaultValue={itemName}
                />
              </Grid>
              <Grid md={0.75} />
              <Grid
                item
                md={1.25}
                sx={{ display: "flex", alignItems: "center" }}
              >
                <Typography variant="h4">標題</Typography>
              </Grid>
              <Grid item md={10}>
                <TextField
                  required
                  id="outlined-required"
                  fullWidth
                  defaultValue={editedTitle}
                />
              </Grid>
              <Grid md={0.75} />
              <Grid
                item
                md={1.25}
                sx={{ display: "flex", alignItems: "center" }}
              >
                <Typography variant="h4">副標題</Typography>
              </Grid>
              <Grid item md={10}>
                <TextField
                  required
                  id="outlined-required"
                  fullWidth
                  defaultValue={editedSubtitle}
                />
              </Grid>
              <Grid md={0.75} />
              <Grid
                item
                md={1.25}
                sx={{ display: "flex", alignItems: "flex-start" }}
              >
                <Typography variant="h4">介紹</Typography>
              </Grid>
              <Grid item md={10}>
                <TextField
                  id="outlined-multiline-flexible"
                  label=""
                  multiline
                  fullWidth
                  rows={40}
                  maxRows={500}
                  defaultValue={editedDesc}
                />
              </Grid>
              <Grid md={0.75} />
              <Grid md={12} marginY={3} marginRight={3}>
                <Divider style={{ border: "1px solid gray" }} />
              </Grid>
              <Grid
                item
                md={1.25}
                sx={{ display: "flex", alignItems: "center" }}
              >
                <Typography variant="h4">圖片</Typography>
              </Grid>
              <Grid item md={8.5}>
                <TextField
                  required
                  id="outlined-required"
                  fullWidth
                  disabled
                  value={selectedFile ? selectedFile.name : ""}
                />
              </Grid>
              <Grid item md={1.5}>
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
                    type="file"
                    ref={fileInputRef}
                    style={{ display: "none" }}
                    onChange={handleFileChange}
                  />
                </Box>
              </Grid>
              <Grid md={12} marginY={3} marginRight={3}>
                <Divider style={{ border: "1px solid gray" }} />
              </Grid>
              <Grid item md={1.25}>
                <Typography variant="h4">販售地點</Typography>
              </Grid>
              <Grid item md={10}>
                <Box className="location">
                  <DataGrid
                    rows={row}
                    columns={columns}
                    checkboxSelection
                    pageSizeOptions={[5, 10]}
                    onRowSelectionModelChange={(newSelection) => {
                      const selecting: string[] = [];
                      newSelection.forEach((value, index, array) => {
                        selecting.push(rowName.at(value as number)!);
                      });
                      setselected(selecting);
                    }}
                  />
                </Box>
              </Grid>
              <Grid md={0.75} />
              <Grid item md={1.25} />
              <Grid item md={1.5}>
                <Select
                  labelId="city-select-label"
                  id="city-select"
                  value={selectcity}
                  fullWidth
                  onChange={handleSelectCityChange}
                >
                  {cities.map((value, index) => (
                    <MenuItem value={value}>{value}</MenuItem>
                  ))}
                </Select>
              </Grid>
              <Grid item md={1.5}>
                <Select
                  labelId="dist-select-label"
                  id="dist-select"
                  value={selectdist}
                  fullWidth
                  onChange={handleSelectDistrictChange}
                >
                  {City[selectcity].map((value, index) => (
                    <MenuItem value={value}>{value}</MenuItem>
                  ))}
                </Select>
              </Grid>
              <Grid item md={7}>
                <TextField
                  id="outlined-multiline-flexible"
                  label=""
                  multiline
                  fullWidth
                  defaultValue={""}
                />
              </Grid>
              <Grid md={9.75} />
              <Grid item md={0.75}>
                <Box
                  width="100%"
                  height="100%"
                  sx={{ display: "flex", justifyContent: "flex-end" }}
                >
                  <Button variant="outlined">新增</Button>
                </Box>
              </Grid>
              <Grid item md={0.75}>
                <Box
                  width="100%"
                  height="100%"
                  sx={{ display: "flex", justifyContent: "flex-end" }}
                >
                  <Button variant="outlined" disabled={true}>
                    刪除
                  </Button>
                </Box>
              </Grid>
              <Grid md={0.75} />
              <Grid md={12} marginY={2} marginRight={3}>
                <Divider style={{ border: "1px solid gray" }} />
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Modal>
    </ThemeProvider>
  );
};

export default ItemUpload;
