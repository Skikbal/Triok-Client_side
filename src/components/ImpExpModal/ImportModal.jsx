import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { useSelector } from "react-redux";
import axios from "axios";
import Modal from "../Modal/Modal";
import ProgressBar from "../ProgressBar";
import useAuth from "../../hooks/useAuth";
import { BASE_URL } from "../../utils/Element";
import verified from "../../assets/images/verified.png";
import { NotificationManager } from "react-notifications";
import { RiDownloadCloud2Line as DownloadIcon } from "react-icons/ri";

const ImportModal = ({ showModal, onClose, from, onCallApi }) => {
  const userType = useSelector((state) => state.userType);
  const [config, configFormData] = useAuth();
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [disable, setDisable] = useState(false);
  const [importRes, setImportRes] = useState("");

  const contactLink = "https://stage-be.tri-oakcrm.com/contact-sample-sheet.xlsx";
  const buyerLink = "https://stage-be.tri-oakcrm.com/buyers-sample-sheet.xlsx";
  const propertyLink = "https://stage-be.tri-oakcrm.com/property-sample-sheet.xlsx";

  const handleDownloadTemplate = () => {
    const url = from === "contact" ? contactLink : from === "buyer" ? buyerLink : from === "property" ? propertyLink : "";
    const tempLink = document.createElement("a");
    tempLink.href = url;
    tempLink.setAttribute("download", `${from}-sample-sheet`);
    tempLink.click();
  };

  const handleImport = () => {
    setDisable(true);

    const sendData = {
      file: file,
      user_id: userType,
      mark_as_lead: 1,
      type: from,
    };

    const propertyData = {
      file: file,
      user_id: userType,
    };

    const dataToSend = from === "property" ? propertyData : sendData;
    const url = from === "property" ? "import-property" : "import-Contacts";

    axios
      .post(`${BASE_URL}/${url}`, dataToSend, configFormData)
      .then((res) => {
        setImportRes(res?.data?.message);
        onCallApi();
        if (res?.data?.message) {
          NotificationManager.success(res?.data?.message);
        }
      })
      .catch((err) => {
        setImportRes("");
        if (err.response?.data?.message && err.response?.data?.message !== "Too Many Attempts.") {
          NotificationManager.error(err.response?.data?.message);
        }
      })
      .finally(() => {
        setDisable(false);
      });
  };

  const handleComplete = () => {
    setFile(null);
    setFileName("");
    setImportRes("");
    onClose();
  };

  const onDrop = useCallback((acceptedFiles) => {
    acceptedFiles.forEach((file) => {
      const reader = new FileReader();

      reader.onload = () => {
        const binaryStr = reader.result;
        console.log(binaryStr);
        // setImagePreview(reader.result);
      };
      // reader.readAsArrayBuffer(file);
      reader.readAsDataURL(file);
      setFile(file);
      setFileName(file?.name);
    });
  }, []);

  const { getRootProps, getInputProps, acceptedFiles, fileRejections } = useDropzone({
    onDrop,
    maxFiles: 1,
    accept: {
      // "image/*": [".jpeg", ".png"],
      "text/*": [".csv", ".xlsx", ".xls"],
    },
  });

  return (
    <Modal title={"Import File"} width="600px" desc={"Quickly populate your database by importing data directly from a CSV file."} show={showModal} onClose={onClose}>
      {file === null ? (
        <>
          <div {...getRootProps()}>
            <input {...getInputProps()} />
            <div class="flex items-center justify-center w-full">
              <div className="flex flex-col items-center justify-center w-full h-48 border-2 green-b border-dashed  cursor-pointer bg-gray-50 dark:hover:bg-bray-800 hover:bg-gray-100">
                <div class="flex flex-col items-center justify-center">
                  <svg className="w-8 h-8 mb-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                    <path stroke="currentColor" stroke-linecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
                  </svg>
                  <p className="mb-2 body-S dark-M">Drag and drop your file here to upload.</p>
                  <p className="head-6 green-H underline">or click to select a file.</p>
                </div>
              </div>
            </div>
          </div>

          {fileRejections?.length !== 0 && <span className="body-S red-D">{fileRejections?.[0]?.errors?.[0]?.message}</span>}

          {from !== "company" && (
            <div className="flex justify-between mt-4">
              <p className="body-S dark-M">Download a premade template file.</p>
              <p role="button" className="green-H flex items-center gap-1" onClick={handleDownloadTemplate}>
                <DownloadIcon />
                <span className="head-5 green-H">Download Template</span>
              </p>
            </div>
          )}
        </>
      ) : (
        <div className="border-dashed border-2 text-center p-10 ">
          <img src={verified} alt="exp" className="mx-auto" />

          <p className=" mt-2 mb-4 ">
            {fileName} <span className="dark-M body-S">Complete: 100%</span>
          </p>
          <ProgressBar width={"100"} />
        </div>
      )}

      {importRes !== "" && <p className="body-S green-H mt-2">{importRes}</p>}

      <div className="mt-6">
        {importRes === "" ? (
          <>
            <button type="button" disabled={disable} className="save-button light-L head-5 w-30 green-bg-H" onClick={handleImport}>
              Upload File
            </button>
            <button type="button" onClick={onClose} className="green-H ml-5">
              Cancel
            </button>
          </>
        ) : (
          <button type="button" className="save-button light-L head-5 w-30 green-bg-H" onClick={handleComplete}>
            Complete
          </button>
        )}
      </div>
    </Modal>
  );
};

export default ImportModal;
