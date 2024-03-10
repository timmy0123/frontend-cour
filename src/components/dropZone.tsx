import React from "react";
import { useDropzone, FileWithPath } from "react-dropzone";
import { useState, useEffect } from "react";
import * as _ from "lodash";
import { Box } from "@mui/material";

require("dotenv").config();
const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
interface dropzoneType {
  children?: any;
  ProjectId?: string;
  dropUpload?: boolean;
  setdropUpload?: React.Dispatch<React.SetStateAction<boolean>>;
}
const baseStyle = {
  flex: 1,
  display: "flex",
  flexDirection: "column" as const,
  alignItems: "center",
  padding: "20px",
  //borderWidth: 2,
  //borderRadius: 2,
  //borderColor: "#eeeeee",
  //borderStyle: "dashed",
  backgroundColor: "#fafafa",
  color: "#bdbdbd",
  outline: "none",
  transition: "border .24s ease-in-out",
};

const focusedStyle = {
  borderColor: "#2196f3",
};

const acceptStyle = {
  backgroundColor: "rgb(207, 235, 177)",
};

const rejectStyle = {
  backgroundColor: "rgb(246, 190, 190)",
};

export const StyledDropzone: React.FC<dropzoneType> = ({ children }) => {
  const {
    getRootProps,
    getInputProps,
    isFocused,
    isDragAccept,
    isDragReject,
    acceptedFiles,
  } = useDropzone({
    accept: { "image/jpeg": [], "image/png": [] },
    noClick: true,
  });

  useEffect(() => {
    if (_.isEmpty(acceptedFiles)) {
      console.log();
    } else {
      (async () => {
        for (const file of acceptedFiles) {
          console.log(file);
          const formData = new FormData();
          formData.append("image", file);
          try {
            const response = await fetch(`${backendUrl}/Image/uploadImage`, {
              method: "POST",
              body: formData,
            });
            // Handle response from the server
            console.log("Response:", response);
            window.location.reload();
          } catch (error) {
            console.error("Error:", file.name);
          }
        }
      })();
    }
  }, [acceptedFiles]);

  const style = React.useMemo(
    () => ({
      ...baseStyle,
      ...(isFocused ? focusedStyle : {}),
      ...(isDragAccept ? acceptStyle : {}),
      ...(isDragReject ? rejectStyle : {}),
    }),
    [isFocused, isDragAccept, isDragReject]
  );

  const files = acceptedFiles.map((file: FileWithPath) => (
    <li key={file.path}>
      uploaded {file.path} - {file.size} bytes
    </li>
  ));

  return (
    <Box
      {...getRootProps({ style })}
      sx={{ overflowY: "scroll", width: "100%" }}
    >
      {children}
    </Box>
  );
};

export default StyledDropzone;
