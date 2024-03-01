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
import { ItemList } from "../interface/interface";
import { getItem } from "../components/components-query/QueryComponent";
import theme from "@/styles/font";
import { City } from "../components/components-Taiwan/discCity";
import { rowtype } from "../interface/interface";
import CloseIcon from "@mui/icons-material/Close";

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
  const [editedlocId, seteditedlocId] = React.useState<string[]>([]);
  const [editedurl, seteditedurl] = React.useState<string>("");
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const [existFile, setexistFile] = React.useState<string>("");
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);
  const [selectcity, setselectcity] = React.useState<string>("臺北市");
  const [selectdist, setselectdist] = React.useState<string>("中正區");
  const [inputStoreName, setinputStoreName] = React.useState<string>("");
  const [inputaddress, setinputaddress] = React.useState<string>("");
  const [selectLoc, setselectLoc] = React.useState<string[]>([]);
  const [dupaddr, setdupaddr] = React.useState<boolean>(false);
  const cities = Object.keys(City);
  const [row, setrow] = React.useState<rowtype[]>([]);
  const [rowName, setrowName] = React.useState<string[]>([]);
  const columns: GridColDef[] = [
    {
      field: "storeName",
      headerName: "商店名稱",
      width: 350,
      editable: false,
    },
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
        storeName: inputStoreName,
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
      if (selectLoc.includes(row[i].address)) continue;
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
    for (let i = 0; i < selectedItemName.length; i++) {
      let Imgname = `fileName=${selectedImgName[i]}`;
      let ItemName = `itemName=${selectedItemName[i]}`;
      await fetch(`${backendUrl}/DeleteItem?${Imgname}&${ItemName}`, {
        method: "Delete",
      });
    }
    setitems([]);
    setselectedItemName([]);
    setselectedImgName([]);
    setLoading(true);
  }

  async function handleSaveItem() {
    if (selectedFile && row) {
      if (openEdited) {
        let Imgname = `fileName=${existFile}`;
        let ItemName = `itemName=${itemName}`;
        await fetch(`${backendUrl}/DeleteItem?${Imgname}&${ItemName}`, {
          method: "Delete",
        });
      }
      const name = `itemname=${itemName}`;
      const title = `title=${editedTitle}`;
      const subtitle = `subtitle=${editedSubtitle}`;
      const city = row.map((value) => `city=${value.city}`).join("&");
      const district = row
        .map((value) => `district=${value.district}`)
        .join("&");
      const address = row.map((value) => `address=${value.address}`).join("&");
      const storeName = row
        .map((value) => `storeName=${value.storeName}`)
        .join("&");
      let fromData = new FormData();

      fromData.append("image", selectedFile);
      fromData.append("description", editedDesc);
      await fetch(
        `${backendUrl}/UploadItem?${name}&${title}&${subtitle}
         &${storeName}&${city}&${district}&${address}`,
        {
          method: "Post",
          body: fromData,
        }
      );
      seteditedDesc("");
      seteditedId("");
      seteditedSubtitle("");
      seteditedId("");
      seteditedlocId([]);
      setitemName("");
      seteditedTitle("");
      setSelectedFile(null);
      setexistFile("");
      seteditedurl("");
      setrow([]);
      setopenAdd(false);
      setopenEdited(false);
      setitems([]);
      setLoading(true);
    } else if (!selectedFile && openEdited) {
      const id = `id=${editedId}`;
      const locid = editedlocId.map((value) => `locid=${value}`).join("&");
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
      const storeName = row
        .map((value) => `storeName=${value.storeName}`)
        .join("&");

      fromData.append("description", editedDesc);
      await fetch(
        `${backendUrl}/EditItem?${name}&${title}&${subtitle}
        &${storeName}&${city}&${district}&${address}&${id}&${locid}`,
        {
          method: "Post",
          body: fromData,
        }
      );
      seteditedDesc("");
      seteditedId("");
      seteditedSubtitle("");
      seteditedId("");
      seteditedlocId([]);
      setitemName("");
      seteditedTitle("");
      setSelectedFile(null);
      setexistFile("");
      seteditedurl("");
      setrow([]);
      setopenAdd(false);
      setopenEdited(false);
      setitems([]);
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
          paddingBottom={7}
          sx={{
            overflowY: "scroll",
            width: "97%",
            height: "95%",
          }}
        >
          <Grid container spacing={2}>
            {!loading ? (
              items ? (
                items.map((Item: ItemList, index: number) => (
                  <Grid item xs={12} key={index} paddingRight={1}>
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
                            id={Item.itemName}
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
                          md={3.2}
                          sx={{
                            cursor: "pointer",
                            display: { xs: "none", md: "flex" },
                            alignItems: "center",
                          }}
                          onClick={() => {
                            seteditedDesc(Item.itemDescription);
                            setitemName(Item.itemName);
                            seteditedId(Item.id);
                            seteditedSubtitle(Item.subtitle);
                            seteditedId(Item.id);
                            seteditedlocId(Item.locid);
                            seteditedTitle(Item.title);
                            setexistFile(
                              Item.pictureUrl.split("/").slice(-1)[0]
                            );
                            seteditedurl(Item.pictureUrl);
                            let newRow: rowtype[] = [];
                            console.log(Item);
                            for (let i = 0; i < Item.city.length; i++) {
                              newRow.push({
                                storeName: Item.storeName[i],
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
                            title={Item.pictureUrl.split("/").slice(-1)[0]}
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
                            seteditedDesc(Item.itemDescription);
                            seteditedId(Item.id);
                            setitemName(Item.itemName);
                            seteditedSubtitle(Item.subtitle);
                            seteditedId(Item.id);
                            seteditedlocId(Item.locid);
                            seteditedTitle(Item.title);
                            setexistFile(
                              Item.pictureUrl.split("/").slice(-1)[0]
                            );
                            seteditedurl(Item.pictureUrl);
                            let newRow: rowtype[] = [];
                            for (let i = 0; i < Item.city.length; i++) {
                              newRow.push({
                                storeName: Item.storeName[i],
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
                            <TextField
                              disabled
                              defaultValue={Item.itemDescription}
                              multiline
                              rows={4}
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
          seteditedlocId([]);
          setitemName("");
          seteditedTitle("");
          setSelectedFile(null);
          setexistFile("");
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
              <Grid item xs={7} sm={8} md={9.25} />
              <Grid item md={1} marginRight={3} marginTop={1}>
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
                <Typography variant="h4">商品名稱</Typography>
              </Grid>
              <Grid item xs={11} sm={11.5} md={10}>
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
              <Grid item xs={12} md={0.75} />
              <Grid
                item
                xs={11}
                sm={11.5}
                md={1.25}
                sx={{ display: "flex", alignItems: "center" }}
              >
                <Typography variant="h4">標題</Typography>
              </Grid>
              <Grid item xs={11} sm={11.5} md={10}>
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
              <Grid item xs={11} sm={11.5} md={10}>
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
                xs={12}
                md={1.25}
                sx={{ display: "flex", alignItems: "flex-start" }}
              >
                <Typography variant="h4">介紹</Typography>
              </Grid>
              <Grid item xs={11} sm={11.5} md={10}>
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
              <Grid item xs={12} marginY={3} marginRight={3}>
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
              <Grid item xs={8.5} md={8.5}>
                <TextField
                  required
                  id="outlined-required"
                  fullWidth
                  disabled
                  value={selectedFile ? selectedFile.name : ""}
                />
              </Grid>
              <Grid item xs={3} md={1.5}>
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
              <Grid item xs={12} md={1.25}>
                <Typography variant="h4">販售地點</Typography>
              </Grid>
              <Grid item xs={12} md={10}>
                <Box className="location">
                  <DataGrid
                    rows={row}
                    columns={columns}
                    checkboxSelection
                    disableRowSelectionOnClick
                    getRowId={(row) => row?.address}
                    pageSizeOptions={[5, 10, 25, 50, 100]}
                    onRowSelectionModelChange={(newSelection) => {
                      const selecting: string[] = [];
                      newSelection.forEach((value) => {
                        selecting.push(value as string);
                      });
                      setselectLoc(selecting);
                    }}
                  />
                </Box>
              </Grid>
              <Grid
                item
                md={0.75}
                sx={{ display: { xs: "none", md: "block" } }}
              />
              <Grid
                item
                md={1.25}
                sx={{ display: { xs: "none", md: "block" } }}
              />
              <Grid item xs={4} md={2}>
                <TextField
                  id="storeName"
                  label="商店名稱"
                  multiline
                  fullWidth
                  defaultValue={""}
                  onChange={(event) => {
                    setinputStoreName(event.target.value as string);
                  }}
                />
              </Grid>
              <Grid item xs={3} md={1.5}>
                <Select
                  labelId="city-select-label"
                  id="city-select"
                  value={selectcity}
                  fullWidth
                  onChange={handleSelectCityChange}
                >
                  {cities.map((value, index) => (
                    <MenuItem value={value} key={index}>
                      {value}
                    </MenuItem>
                  ))}
                </Select>
              </Grid>
              <Grid item xs={3} md={1.5}>
                <Select
                  labelId="dist-select-label"
                  id="dist-select"
                  value={selectdist}
                  fullWidth
                  onChange={handleSelectDistrictChange}
                >
                  {City[selectcity].map((value, index) => (
                    <MenuItem value={value} key={index}>
                      {value}
                    </MenuItem>
                  ))}
                </Select>
              </Grid>
              <Grid item xs={11} sm={11.5} md={5}>
                <TextField
                  id="address"
                  label="address"
                  multiline
                  fullWidth
                  defaultValue={""}
                  onChange={(event) => {
                    setinputaddress(event.target.value as string);
                  }}
                />
              </Grid>
              <Grid
                item
                md={9.75}
                sx={{ display: { xs: "none", md: "block" } }}
              />
              <Grid item xs={8} sm={10} md={0.75}>
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
              <Grid item xs={2.5} sm={2} md={0.75}>
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
              <Grid item md={0.75} />
              <Grid item md={12} marginY={2} marginRight={3}>
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
