import * as React from "react";
import { Grid, Box, Stack, Button, Checkbox, Modal } from "@mui/material";
import { Typography, ThemeProvider } from "@material-ui/core";
import Divider from "@mui/material/Divider";
import { ItemList } from "../interface/interface";
import { getItem } from "../components/components-query/QueryComponent";
import theme from "@/styles/font";

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
          seteditedTitle("");
          seteditedurl("");
          setopenAdd(false);
          setopenEdited(false);
        }}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box className="addItem">
          <Typography variant="body1">{editedDesc}</Typography>
        </Box>
      </Modal>
    </ThemeProvider>
  );
};

export default ItemUpload;
