import * as React from "react";
import { Grid, Box, Stack, Button } from "@mui/material";
import { Typography, ThemeProvider } from "@material-ui/core";
import { signOut } from "next-auth/react";
import { Session } from "next-auth";
import theme from "@/styles/font";
import Divider from "@mui/material/Divider";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ImageUpload from "./img";
import ItemUpload from "./item";

interface mainType {
  session: Session;
}
export const MainContent: React.FC<mainType> = ({ session }) => {
  const [showTool, setshowTool] = React.useState<boolean>(true);
  const [itemSelect, setitemSelect] = React.useState<boolean>(false);
  const [imgSelect, setimgSelect] = React.useState<boolean>(true);
  const [absSelect, setabsSelect] = React.useState<boolean>(false);

  return (
    <ThemeProvider theme={theme}>
      <Stack direction={"row"} spacing={0.2} className="main">
        <Box
          width={showTool ? "20vw" : "2.5vw"}
          height="100vh"
          className="slidebar"
        >
          <Stack spacing={0.2} width="100%" height="100%">
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-start",
                alignItems: "flex-end",
              }}
            >
              <Grid container marginLeft={1} marginTop={1}>
                <Grid item md={10} display={showTool ? "block" : "none"}>
                  <Typography variant="h1">Company</Typography>
                </Grid>
                <Grid item md={1}>
                  {showTool ? (
                    <ChevronLeftIcon sx={{ fontSize: 50 }} />
                  ) : (
                    <ChevronRightIcon sx={{ fontSize: 50 }} />
                  )}
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
                }}
              >
                <Typography variant="h2">商品</Typography>
              </Button>
            </Box>
            <button onClick={() => signOut()}>Sign Out</button>
          </Stack>
        </Box>
        <Box width="100%" height="100%">
          {imgSelect ? (
            <ImageUpload />
          ) : absSelect ? (
            <></>
          ) : itemSelect ? (
            <ItemUpload />
          ) : (
            <></>
          )}
        </Box>
      </Stack>
    </ThemeProvider>
  );
};
