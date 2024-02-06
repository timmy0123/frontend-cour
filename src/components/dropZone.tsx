import React from "react";
import { useDropzone, FileWithPath } from "react-dropzone";
import { useState, useEffect } from "react";
import * as _ from "lodash";
import { Box } from "@mui/material";

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
  borderWidth: 2,
  borderRadius: 2,
  borderColor: "#eeeeee",
  borderStyle: "dashed",
  backgroundColor: "#fafafa",
  color: "#bdbdbd",
  outline: "none",
  transition: "border .24s ease-in-out",
};

const focusedStyle = {
  borderColor: "#2196f3",
};

const acceptStyle = {
  borderColor: "#00e676",
};

const rejectStyle = {
  borderColor: "#ff1744",
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
    accept: { "application/octet-stream": [".inp"] },
    noClick: true,
  });

  useEffect(() => {
    if (_.isEmpty(acceptedFiles)) {
      console.log();
    } else {
      acceptedFiles.forEach((file: any) => {
        const reader = new FileReader();

        reader.readAsText(file);
        reader.onabort = () => console.log("file reading was aborted");
        reader.onerror = () => console.log("file reading has failed");
        reader.onload = () => {
          const dataUri = reader.result as string;

          // const binaryStr = reader.result;
          // console.log(binaryStr);
        };
        // reader.readAsArrayBuffer(file);
      });
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
    <Box className="container" height="100%">
      <Box {...getRootProps({ style })}>
        <input {...getInputProps()} />
        {children}
      </Box>
    </Box>
  );
};

export default StyledDropzone;

export const FileDropzone: React.FC<dropzoneType> = ({
  children,
  ProjectId,
  dropUpload,
  setdropUpload,
}) => {
  const [content, setcontent] = React.useState<string>();

  const maxsize = 1048576 * 1;

  const {
    getRootProps,
    getInputProps,
    isFocused,
    isDragAccept,
    isDragReject,
    acceptedFiles,
  } = useDropzone({
    noClick: true,
  });

  useEffect(() => {
    if (_.isEmpty(acceptedFiles)) {
      setcontent(undefined);
    } else {
      acceptedFiles.forEach((file: any) => {
        const reader = new FileReader();

        reader.readAsText(file);
        reader.onabort = () => console.log("file reading was aborted");
        reader.onerror = () => console.log("file reading has failed");
        reader.onload = () => {
          const dataUri = reader.result as string;
          setcontent(dataUri);
          // const binaryStr = reader.result;
          // console.log(binaryStr);
        };
        // reader.readAsArrayBuffer(file);
      });
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
    <Box className="container" height="100%">
      <Box {...getRootProps({ style })}>
        <input {...getInputProps()} />
        {children}
      </Box>
    </Box>
  );
};

//<div className="container">
//<div {...getRootProps({ style })}>
//    <input {...getInputProps()} />
//    {children}
//</div>
//<aside>
//    <h4>Files</h4>
//    <ul>{files}</ul>
//</aside>
//</div>

//const Page: NextPageWithApollo = () => (
//  <StyledDropzone>
//    <div>
//      <a> drop</a>
//    </div>
//  </StyledDropzone>
//);
//
//export default Page;
