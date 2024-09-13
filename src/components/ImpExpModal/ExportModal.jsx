import React, { useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import Modal from "../Modal/Modal";
import ProgressBar from "../ProgressBar";
import useAuth from "../../hooks/useAuth";
import { BASE_URL } from "../../utils/Element";
import upload from "../../assets/images/upload.png";
import verified from "../../assets/images/verified.png";
import { NotificationManager } from "react-notifications";

const ExportModal = ({ showModal, onClose, exportCsvData, from, selectedData, onCallApi }) => {
  const [config] = useAuth();
  const [slider, setSlider] = useState(false);
  const [exportRes, setExportRes] = useState();
  const [disable, setDisable] = useState(false);
  const userType = useSelector((state) => state.userType);

  const fileName = `${from}-export`;

  const sliderhandler = (e) => {
    setSlider(true);
  };

  const handleSelectedDownloadCSV = async () => {
    try {
      const csvContent = "data:text/csv;charset=utf-8," + exportCsvData?.map((e) => e.join(",")).join("\n");
      const url = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `fileName-${Date.now()}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      onCallApi();
      onClose();
    } catch (error) {
      console.log("err", error);
    }
  };

  const handleDownloadCSV = () => {
    setDisable(true);
    axios
      .get(`${BASE_URL}/export-Contacts?user_id=${userType}&format=csv&type=${from}`, config)
      .then((res) => {
        setExportRes(res?.data);
        if (res?.data?.message) {
          NotificationManager.success(res?.data?.message);
        }
        const tempLink = document.createElement("a");
        tempLink.href = res?.data?.file_url;
        tempLink.setAttribute("download", res?.data?.file_name);
        tempLink.click();
        onClose();
      })
      .catch((err) => {
        setExportRes();
        if (err.response?.data?.message && err.response?.data?.message !== "Too Many Attempts.") {
          NotificationManager.error(err.response?.data?.message);
        }
      })
      .finally(() => {
        setDisable(false);
      });
  };

  const handleDownload = () => {
    if (selectedData && selectedData?.length !== 0) {
      handleSelectedDownloadCSV();
    } else {
      handleDownloadCSV();
    }
  };

  return (
    <Modal title={"Export File"} width="600px" desc={"Easily export your data for backup or analysis purposes"} show={showModal} onClose={onClose}>
      <div className="">
        <div className="border-dashed border-2 green-b text-center p-10 ">
          {slider ? <img src={verified} alt="exp" className=" mx-auto" /> : <img src={upload} alt="exp" className="mx-auto" />}
          <p className=" mt-2 mb-4  green-b">
            {fileName}.csv <span className=" dark-M body-S">{slider ? "Complete: 100%" : ""}</span>
          </p>
          <ProgressBar width={slider ? "100" : "0"} />
        </div>
      </div>

      <div className="mt-6">
        {slider ? (
          <button disabled={disable} className="save-button light-L head-5 w-30 green-bg-H" onClick={handleDownload}>
            Download
          </button>
        ) : (
          <>
            <button className="save-button light-L head-5 w-30 green-bg-H" onClick={sliderhandler}>
              Get File
            </button>
            <button onClick={onClose} className="green-H ml-5">
              Cancel
            </button>
          </>
        )}
      </div>
    </Modal>
  );
};

export default ExportModal;
