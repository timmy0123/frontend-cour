import * as React from "react";
import { Grid, Box, Stack, Button, Modal, IconButton } from "@mui/material";
import { Typography, ThemeProvider } from "@material-ui/core";
import { signOut } from "next-auth/react";
import { Session } from "next-auth";
import theme from "@/styles/font";
import Divider from "@mui/material/Divider";
import ReorderIcon from "@mui/icons-material/Reorder";
import ImageUpload from "./img";
import ItemUpload from "./item";
import AbsUpload from "./abs";
import PasswordSetting from "./password";
import CloseIcon from "@mui/icons-material/Close";

interface mainType {
  session: Session;
}
export const MainContent: React.FC<mainType> = ({ session }) => {
  const [showTool, setshowTool] = React.useState<boolean>(false);
  const [itemSelect, setitemSelect] = React.useState<boolean>(false);
  const [imgSelect, setimgSelect] = React.useState<boolean>(true);
  const [absSelect, setabsSelect] = React.useState<boolean>(false);
  const [passwordSelect, setpasswordSelect] = React.useState<boolean>(false);

  return (
    <ThemeProvider theme={theme}>
      <Box className="slidebar-phone" onClick={() => setshowTool(true)}>
        <ReorderIcon />
      </Box>
      <Stack direction={"row"} spacing={0.2} className="main">
        <Box width="20vw" height="100vh" className="slidebar">
          <Stack spacing={0.2} width="100%" height="100%">
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-start",
                alignItems: "flex-end",
              }}
            >
              <Grid container marginLeft={1} marginTop={1}>
                <Grid item md={10}>
                  <Typography variant="h1">Yiikoo</Typography>
                </Grid>
                <Grid item md={1}></Grid>
              </Grid>
            </Box>
            <Divider className="divider" />
            <Box
              sx={{
                display: "flex",
                justifyContent: showTool ? "center" : "flex-start",
                alignItems: "flex-end",
                backgroundColor: imgSelect ? "gray" : "none",
                "&:hover": {
                  backgroundColor: "black",
                },
              }}
            >
              <Button
                variant="text"
                onClick={() => {
                  setimgSelect(true);
                  setabsSelect(false);
                  setitemSelect(false);
                }}
              >
                <Typography variant="h2">輪播圖</Typography>
              </Button>
            </Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: showTool ? "center" : "flex-start",
                alignItems: "flex-end",
                backgroundColor: absSelect ? "gray" : "none",
                "&:hover": {
                  backgroundColor: "black",
                },
              }}
            >
              <Button
                variant="text"
                onClick={() => {
                  setimgSelect(false);
                  setabsSelect(true);
                  setitemSelect(false);
                }}
              >
                <Typography variant="h2">簡介</Typography>
              </Button>
            </Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: showTool ? "center" : "flex-start",
                alignItems: "flex-end",
                backgroundColor: itemSelect ? "gray" : "none",
                "&:hover": {
                  backgroundColor: "black",
                },
              }}
            >
              <Button
                variant="text"
                onClick={() => {
                  setimgSelect(false);
                  setabsSelect(false);
                  setitemSelect(true);
                  setpasswordSelect(false);
                }}
              >
                <Typography variant="h2">商品</Typography>
              </Button>
            </Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: showTool ? "center" : "flex-start",
                alignItems: "flex-end",
                backgroundColor: passwordSelect ? "gray" : "none",
                "&:hover": {
                  backgroundColor: "black",
                },
              }}
            >
              <Button
                variant="text"
                onClick={() => {
                  setimgSelect(false);
                  setabsSelect(false);
                  setitemSelect(false);
                  setpasswordSelect(true);
                }}
              >
                <Typography variant="h2">更改密碼</Typography>
              </Button>
            </Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: showTool ? "center" : "flex-start",
                alignItems: "flex-end",
                "&:hover": {
                  backgroundColor: "black",
                },
              }}
            >
              <Button variant="text" onClick={() => signOut()}>
                <Typography variant="h2">登出</Typography>
              </Button>
            </Box>
          </Stack>
        </Box>
        <Box width="100%" height="100%">
          {imgSelect ? (
            <ImageUpload />
          ) : absSelect ? (
            <AbsUpload />
          ) : itemSelect ? (
            <ItemUpload />
          ) : passwordSelect ? (
            <PasswordSetting />
          ) : (
            <></>
          )}
        </Box>
      </Stack>
      <Modal
        open={showTool}
        onClose={() => {
          setshowTool(false);
        }}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box className="menu">
          <Stack spacing={0.2} width="100%" height="100%">
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-start",
                alignItems: "flex-end",
              }}
            >
              <Grid container marginLeft={1} marginTop={1}>
                <Grid item xs={10.7} sm={11.2}>
                  <Typography variant="h1">Yiikoo</Typography>
                </Grid>
                <Grid item xs={1.3} sm={0.8}>
                  <IconButton
                    style={{ color: "white" }}
                    onClick={() => {
                      setshowTool(false);
                    }}
                  >
                    <CloseIcon />
                  </IconButton>
                </Grid>
              </Grid>
            </Box>
            <Divider className="divider" />
            <Box
              sx={{
                display: "flex",
                justifyContent: showTool ? "center" : "flex-start",
                alignItems: "flex-end",
                backgroundColor: imgSelect ? "gray" : "none",
                "&:hover": {
                  backgroundColor: "black",
                },
              }}
            >
              <Button
                variant="text"
                onClick={() => {
                  setimgSelect(true);
                  setabsSelect(false);
                  setitemSelect(false);
                }}
              >
                <Typography variant="h2">輪播圖</Typography>
              </Button>
            </Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: showTool ? "center" : "flex-start",
                alignItems: "flex-end",
                backgroundColor: absSelect ? "gray" : "none",
                "&:hover": {
                  backgroundColor: "black",
                },
              }}
            >
              <Button
                variant="text"
                onClick={() => {
                  setimgSelect(false);
                  setabsSelect(true);
                  setitemSelect(false);
                }}
              >
                <Typography variant="h2">簡介</Typography>
              </Button>
            </Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: showTool ? "center" : "flex-start",
                alignItems: "flex-end",
                backgroundColor: itemSelect ? "gray" : "none",
                "&:hover": {
                  backgroundColor: "black",
                },
              }}
            >
              <Button
                variant="text"
                onClick={() => {
                  setimgSelect(false);
                  setabsSelect(false);
                  setitemSelect(true);
                  setpasswordSelect(false);
                }}
              >
                <Typography variant="h2">商品</Typography>
              </Button>
            </Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: showTool ? "center" : "flex-start",
                alignItems: "flex-end",
                backgroundColor: passwordSelect ? "gray" : "none",
                "&:hover": {
                  backgroundColor: "black",
                },
              }}
            >
              <Button
                variant="text"
                onClick={() => {
                  setimgSelect(false);
                  setabsSelect(false);
                  setitemSelect(false);
                  setpasswordSelect(true);
                }}
              >
                <Typography variant="h2">更改密碼</Typography>
              </Button>
            </Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: showTool ? "center" : "flex-start",
                alignItems: "flex-end",
                "&:hover": {
                  backgroundColor: "black",
                },
              }}
            >
              <Button variant="text" onClick={() => signOut()}>
                <Typography variant="h2">登出</Typography>
              </Button>
            </Box>
          </Stack>
        </Box>
      </Modal>
    </ThemeProvider>
  );
};
