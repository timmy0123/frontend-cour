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
  Alert,
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
  const [selectedItemName, setselectedItemName] = React.useState<string[]>([]);
  const [selectedImgName, setselectedImgName] = React.useState<string[]>([]);
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
  const [inputaddress, setinputaddress] = React.useState<string>("");
  const [dupaddr, setdupaddr] = React.useState<boolean>(false);
  const cities = Object.keys(City);
  const [row, setrow] = React.useState<rowtype[]>([]);
  const [rowName, setrowName] = React.useState<string[]>([]);
  const columns: GridColDef[] = [
    {
      field: "city",
      headerName: "城市",
      width: 250,
      editable: false,
    },
    {
      field: "district",
      headerName: "行政區",
      width: 250,
      editable: false,
    },
    {
      field: "address",
      headerName: "地址",
      width: 510,
      editable: false,
    },
  ];

  const handleSelectCityChange = (event: SelectChangeEvent) => {
    setselectcity(event.target.value as string);
    setselectdist("");
  };

  const handleSelectDistrictChange = (event: SelectChangeEvent) => {
    console.log(event.target.value);
    setselectdist(event.target.value as string);
  };

  const handleFileChange = (event: any) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleButtonClick = () => {
    // Trigger file input click when the button is clicked
    fileInputRef!.current!.click();
  };

  const handleAddLoc = () => {
    const newRow = [...row];
    const ids = row.length;
    let dup: boolean = false;
    for (let i = 0; i < newRow.length; i++) {
      if (newRow[i].address === inputaddress) dup = true;
    }
    if (!dup) {
      newRow.push({
        city: selectcity,
        district: selectdist,
        address: inputaddress,
      });
      setrow(newRow);
    } else {
      setdupaddr(true);
    }
  };

  const handleDeleteLoc = () => {
    const newRow: rowtype[] = [];
    for (let i = 0; i < row.length; i++) {
      if (selectedItemName.includes(row[i].address)) continue;
      newRow.push(row[i]);
    }
    setrow(newRow);
  };

  (async () => {
    if (loading) {
      const res = await getItem();
      if (res.length > 0) setitems(res);
      setLoading(false);
    }
  })();

  async function handleDeleteItem() {
    console.log(selectedItemName);
    for (let i = 0; i < selectedItemName.length; i++) {
      console.log(selectedImgName);
      let Imgname = `fileName=${selectedImgName[i]}`;
      let ItemName = `itemName=${selectedItemName[i]}`;
      await fetch(`${backendUrl}/DeleteItem?${Imgname}&${ItemName}`, {
        method: "Delete",
      });
    }
    setselectedItemName([]);
    setselectedImgName([]);
    setLoading(true);
  }

  async function handleSaveItem() {
    if (selectedFile && row) {
      if (openEdited) {
        let Imgname = `filename=${selectedFile!.name}`;
        let ItemName = `itemName=${itemName}`;
        await fetch(`${backendUrl}/DeleteItem?${Imgname}&${ItemName}`, {
          method: "Delete",
        });
      }
      const name = `itemname=${itemName}`;
      const title = `title=${editedTitle}`;
      const subtitle = `subtitle=${editedSubtitle}`;
      const description = `description=${editedDesc}`;
      const city = row.map((value) => `city=${value.city}`).join("&");
      const district = row
        .map((value) => `district=${value.district}`)
        .join("&");
      const address = row.map((value) => `address=${value.address}`).join("&");
      let fromData = new FormData();
      console.log(city);

      fromData.append("image", selectedFile);
      console.log(77654);
      await fetch(
        `${backendUrl}/UploadItem?${name}&${title}&${subtitle}&${description}
                     &${city}&${district}&${address}`,
        {
          method: "Post",
          body: fromData,
        }
      );

      setopenAdd(false);
      setopenEdited(false);
      setLoading(true);
    }
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
          paddingRight={2}
          paddingBottom={7}
          sx={{
            overflowY: "scroll",
            width: "100%",
            height: "95%",
          }}
        >
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
                              const imgName = Item.pictureUrl
                                .split("/")
                                .slice(-1)[0];
                              const index = selectedItemName.indexOf(name);

                              if (index > -1) {
                                selectedItemName.splice(index, 1);
                                selectedImgName.splice(index, 1);
                              } else {
                                selectedItemName.push(name);
                                selectedImgName.push(imgName);
                              }
                              setselectedItemName(selectedItemName);
                              setselectedImgName(selectedImgName);
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
                            let newRow: rowtype[] = [];
                            console.log(Item);
                            for (let i = 0; i < Item.city.length; i++) {
                              newRow.push({
                                city: Item.city[i],
                                district: Item.district[i],
                                address: Item.address[i],
                              });
                            }
                            setrow(newRow);
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
                            let newRow: rowtype[] = [];
                            for (let i = 0; i < Item.city.length; i++) {
                              newRow.push({
                                city: Item.city[i],
                                district: Item.district[i],
                                address: Item.address[i],
                              });
                            }
                            setrow(newRow);
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
          setrow([]);
          setopenAdd(false);
          setopenEdited(false);
        }}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box className="addItem">
          {dupaddr ? (
            <Alert
              severity="error"
              onClose={() => {
                setdupaddr(false);
              }}
            >
              重複地址
            </Alert>
          ) : (
            <></>
          )}
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
                  <Button variant="outlined" onClick={handleSaveItem}>
                    儲存
                  </Button>
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
                  onChange={(event) => {
                    setitemName(event.target.value as string);
                  }}
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
                  onChange={(event) => {
                    seteditedTitle(event.target.value as string);
                  }}
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
                  onChange={(event) => {
                    seteditedSubtitle(event.target.value as string);
                  }}
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
                  defaultValue={editedDesc}
                  onChange={(event) => {
                    seteditedDesc(event.target.value as string);
                  }}
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
                    disableRowSelectionOnClick
                    getRowId={(row) => row?.address}
                    pageSizeOptions={[5, 10]}
                    onRowSelectionModelChange={(newSelection) => {
                      const selecting: string[] = [];
                      newSelection.forEach((value) => {
                        selecting.push(value as string);
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
                  onChange={(event) => {
                    setinputaddress(event.target.value as string);
                  }}
                />
              </Grid>
              <Grid md={9.75} />
              <Grid item md={0.75}>
                <Box
                  width="100%"
                  height="100%"
                  sx={{ display: "flex", justifyContent: "flex-end" }}
                >
                  <Button variant="outlined" onClick={handleAddLoc}>
                    新增
                  </Button>
                </Box>
              </Grid>
              <Grid item md={0.75}>
                <Box
                  width="100%"
                  height="100%"
                  sx={{ display: "flex", justifyContent: "flex-end" }}
                >
                  <Button variant="outlined" onClick={handleDeleteLoc}>
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
