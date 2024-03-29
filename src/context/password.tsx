import * as React from "react";
import { useState } from "react";
import {
  Grid,
  Box,
  Stack,
  Button,
  Checkbox,
  TextField,
  Alert,
} from "@mui/material";
import { Typography, ThemeProvider } from "@material-ui/core";
import theme from "@/styles/font";
import { Checktype, Resettype } from "../interface/interface";

require("dotenv").config();
const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

const Check: React.FC<Checktype> = ({ onSuccess }) => {
  const [user, setuser] = useState<string>("");
  const [password, setpassword] = useState<string>("");
  const [alert, setalert] = useState<boolean>(false);

  async function handleSubmit() {
    const res = await fetch(
      `${backendUrl}/User/GetUser?username=${user}&password=${password}`,
      {
        method: "GET",
      }
    );
    const _user = await res.json();
    // If no error and we have user data, return it
    if (res.ok && _user) {
      onSuccess();
    } else {
      setalert(true);
    }
  }

  return (
    <ThemeProvider theme={theme}>
      {alert ? (
        <Alert
          severity="error"
          onClose={() => {
            setalert(false);
          }}
        >
          錯誤使用者
        </Alert>
      ) : (
        <></>
      )}
      <Grid
        container
        width="100%"
        height="100%"
        sx={{ display: "flex", alignItems: "center" }}
      >
        <Grid item xs={12} md={2.5}>
          <Typography variant="h6">舊使用者</Typography>
        </Grid>
        <Grid item xs={11.5} md={9.3}>
          <TextField
            id="old-user"
            label="old user"
            fullWidth
            defaultValue={""}
            onChange={(event) => {
              setuser(event.target.value as string);
            }}
          />
        </Grid>
        <Grid item xs={12} md={2.5}>
          <Typography variant="h6">舊密碼</Typography>
        </Grid>
        <Grid item xs={11.5} md={9.3}>
          <TextField
            id="old-password"
            label="old password"
            variant="outlined"
            type="password"
            fullWidth
            onChange={(event) => {
              setpassword(event.target.value as string);
            }}
          />
        </Grid>
        <Grid item xs={12} sx={{ display: "flex", justifyContent: "flex-end" }}>
          <Button onClick={handleSubmit}>確認</Button>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
};

const Change: React.FC<Resettype> = ({ onSuccess }) => {
  const [newuser, setnewuser] = useState<string>("");
  const [newpassword, setnewpassword] = useState<string>("");
  const [newpasswordCheck, setnewpasswordCheck] = useState<string>("");
  const [alert, setalert] = useState<boolean>(false);

  async function handleSubmit() {
    if (newpassword == newpasswordCheck) {
      const res = await fetch(
        `${backendUrl}/User/UpdateUser?username=${newuser}&password=${newpassword}`,
        {
          method: "PUT",
        }
      );
      const _user = await res.json();
      // If no error and we have user data, return it
      if (res.ok && _user) {
        onSuccess();
      }
    } else {
      setalert(true);
    }
  }

  return (
    <ThemeProvider theme={theme}>
      {alert ? (
        <Alert
          severity="error"
          onClose={() => {
            setalert(false);
          }}
        >
          密碼不一致
        </Alert>
      ) : (
        <></>
      )}
      <Grid
        container
        width="100%"
        height="100%"
        sx={{ display: "flex", alignItems: "center" }}
      >
        <Grid item xs={12} md={2.5}>
          <Typography variant="h6">新使用者</Typography>
        </Grid>
        <Grid item xs={11.5} md={9.3}>
          <TextField
            id="new-user"
            label="new user"
            fullWidth
            defaultValue={""}
            onChange={(event) => {
              setnewuser(event.target.value as string);
            }}
          />
        </Grid>
        <Grid item xs={12} md={2.5}>
          <Typography variant="h6">新密碼</Typography>
        </Grid>
        <Grid item xs={11.5} md={9.3}>
          <TextField
            id="new-password"
            label="new password"
            variant="outlined"
            type="password"
            fullWidth
            onChange={(event) => {
              setnewpassword(event.target.value as string);
            }}
          />
        </Grid>
        <Grid item xs={12} md={2.5}>
          <Typography variant="h6">確認密碼</Typography>
        </Grid>
        <Grid item xs={11.5} md={9.3}>
          <TextField
            id="conform-password"
            label="conform password"
            variant="outlined"
            type="password"
            fullWidth
            onChange={(event) => {
              setnewpasswordCheck(event.target.value as string);
            }}
          />
        </Grid>
        <Grid item xs={12} sx={{ display: "flex", justifyContent: "flex-end" }}>
          <Button onClick={handleSubmit}>確認</Button>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
};

const PasswordSetting: React.FC = () => {
  const [pass, setPass] = useState<boolean>(false);

  return (
    <ThemeProvider theme={theme}>
      <Box className="password">
        {!pass ? (
          <Check onSuccess={() => setPass(true)} />
        ) : (
          <Change onSuccess={() => setPass(false)} />
        )}
      </Box>
    </ThemeProvider>
  );
};

export default PasswordSetting;
