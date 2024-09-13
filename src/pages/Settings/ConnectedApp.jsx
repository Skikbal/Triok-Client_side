import React, { useEffect, useState } from "react";
import { NotificationManager } from "react-notifications";
import axios from "axios";
import useAuth from "../../hooks/useAuth";
import Loader from "../../components/Loader";
import { BASE_URL } from "../../utils/Element";
import BaseLayout from "../../layouts/BaseLayout";
import gmail from "../../assets/images/gmail.png";
import mailchimp from "../../assets/images/mailchimp.png";
import ringcentral from "../../assets/images/ringcentral.png";

const ConnectedApp = () => {
  const [config] = useAuth();
  const [loading, setLoading] = useState(false);
  const [connectedAppData, setConnectedAppData] = useState({
    gmail: "",
    mailchimp: "",
    ringcentral: "",
  });

  const DataBox = ({ image, title, desc, account, handleConnect, handleDisconnect }) => {
    return (
      <div className="flex items-center gap-6">
        <img src={image} alt="" style={{ height: "85px" }} />
        <div className="flex-1">
          <p className="head-4 dark-H">{title}</p>
          <p className="dark-M body-N mt-1">{desc}</p>
          {account !== "" && (
            <p className="tags green-H body-S mt-2" style={{ textTransform: "lowercase" }}>
              {account}
            </p>
          )}
        </div>
        <div>
          <p
            role="button"
            className="tags green-H body-S"
            onClick={() => {
              if (account !== "") {
                handleDisconnect();
              } else {
                handleConnect();
              }
            }}
          >
            {account !== "" ? "Disconnected Account" : "Connected Account"}
          </p>
        </div>
      </div>
    );
  };

  const fetchData = () => {
    setLoading(true);
    axios
      .get(`${BASE_URL}/connectedapp-data`, config)
      .then((res) => {
        const data = res?.data?.data;
        setConnectedAppData({
          ...connectedAppData,
          gmail: data?.gmail?.email ?? "",
        });
      })
      .catch((err) => {
        if (err.response?.data?.message && err.response?.data?.message !== "Too Many Attempts.") {
          NotificationManager.error(err.response?.data?.message);
        }
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleGmailConnect = async () => {
    axios.get(`${BASE_URL}/google/redirect`, config).then((res) => {
      if (res?.data?.auth_url) {
        const width = 800;
        const height = 600;
        const googleAuthUrl = res?.data?.auth_url;
        const left = window.innerWidth / 2 - width / 2;
        const top = window.innerHeight / 2 - height / 2;
        const options = `width=${width},height=${height},left=${left},top=${top},modal=yes,centerscreen=yes`;

        const googleWindow = window.open(googleAuthUrl, "Google Authentication", options);

        const handleMessage = (event) => {
          if (event.source === googleWindow) {
            console.log("Response", event);
            if (event?.data) {
              fetchData();
              googleWindow.close();
              window.close();
              window.removeEventListener("message", handleMessage);
            } else {
              googleWindow.close();
              window.close();
            }
          }
          if (googleWindow && !googleWindow.closed) {
            googleWindow.close();
            window.close();
          }
        };

        // Add the event listener for message events
        window.addEventListener("message", handleMessage);

        // // Clean up the event listener when the component unmounts
        // return () => {
        //   window.removeEventListener("message", handleMessage);
        // };
      }
    });
  };

  const handleDisconnect = (type) => {
    axios
      .delete(`${BASE_URL}/disconnect-email?type=${type}`, config)
      .then((res) => {
        fetchData();
        if (res?.data?.message) {
          NotificationManager.success("Account Disconnected Successfully!");
        }
      })
      .catch((err) => {
        if (err.response?.data?.message && err.response?.data?.message !== "Too Many Attempts.") {
          NotificationManager.error(err.response?.data?.message);
        }
      });
  };

  const handleRingCentralConnect = () => {
    console.log("call");
  };

  const handleMailChimpConnect = () => {
    console.log("call");
  };

  return (
    <BaseLayout>
      <div className="flex justify-between items-center">
        <p className="head-1 dark-H">Connected App</p>
        {/* <button className="add-contact-button green-bg-H light-L body-S mr-4">Save</button> */}
      </div>

      {loading ? (
        <Loader />
      ) : (
        <div className="light-bg-L p-5 body-L dark-M table-container h-[78vh] overflow-y-auto">
          <DataBox
            image={gmail}
            title={"Gmail"}
            account={connectedAppData?.gmail}
            handleConnect={handleGmailConnect}
            handleDisconnect={() => {
              handleDisconnect("gmail");
            }}
            desc={"Connect Gmail to synchronize emails and manage communication directly within the dashboard."}
          />
          <hr className="my-4 dark-L" />

          <DataBox
            image={mailchimp}
            title={"Mailchimp"}
            account={connectedAppData?.mailchimp}
            handleConnect={handleMailChimpConnect}
            handleDisconnect={() => {
              handleDisconnect("mailchimp");
            }}
            desc={"Link Mailchimp to streamline email marketing campaigns and monitor their performance through the dashboard."}
          />
          <hr className="my-4 dark-L" />

          <DataBox
            image={ringcentral}
            title={"RingCentral"}
            account={connectedAppData?.ringcentral}
            handleConnect={handleRingCentralConnect}
            handleDisconnect={() => {
              handleDisconnect("ringcentral");
            }}
            desc={"Integrate RingCentral for seamless call management and to track call logs and activities in one place."}
          />
        </div>
      )}
    </BaseLayout>
  );
};

export default ConnectedApp;
