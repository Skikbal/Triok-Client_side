import React, { useEffect, useState } from "react";
import { NotificationManager } from "react-notifications";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import moment from "moment";
import axios from "axios";
import useAuth from "../../hooks/useAuth";
import Loader from "../../components/Loader";
import Plus from "../../assets/svgs/Plus.svg";
import { BASE_URL } from "../../utils/Element";
import BaseLayout from "../../layouts/BaseLayout";
import swap from "../../assets/svgs/swap-vertical.svg";
import sortAsce from "../../assets/svgs/sort-ascending.svg";
import sortDesc from "../../assets/svgs/sort-descending.svg";
import ContactPagination from "../../components/Pagination/ContactPagination";

const contactcloseData = [
  { id: 1, propertyname: "DG- Tifton ,GA", data1: "12/09/2024", data2: "23/08/2024", data3: "12/06/2024", data4: "23/07/2024", data5: "23/06/2023", data6: "12/05/2022", data7: "12/05/2023", data6: "12/05/2023", data6: "20/12/2024", data7: "12/06/2024", data8: "12/05/2024", data9: "12/02/2024", data10: "23/07/2024", data11: "12/05/2024", data12: "12/05/2024", data13: "12/04/2024", data14: "12/04/2024", data15: "12/08/2024", data16: "12/09/2024", data17: "22/05/2024", data18: "12/09/2024", data19: "12/09/2022", data20: "12/05/2024", data21: "12/09/2023", data22: "12/08/2023" },
  { id: 2, propertyname: "DG- Tifton ,GA", data1: "12/09/2024", data2: "23/08/2024", data3: "12/06/2024", data4: "23/07/2024", data5: "23/06/2023", data6: "12/05/2022", data7: "12/05/2023", data6: "12/05/2023", data6: "20/12/2024", data7: "12/06/2024", data8: "12/05/2024", data9: "12/02/2024", data10: "23/07/2024", data11: "12/05/2024", data12: "12/05/2024", data13: "12/04/2024", data14: "12/04/2024", data15: "12/08/2024", data16: "12/09/2024", data17: "22/05/2024", data18: "12/09/2024", data19: "12/09/2022", data20: "12/05/2024", data21: "12/09/2023", data22: "12/08/2023" },
  { id: 3, propertyname: "DG- Tifton ,GA", data1: "12/09/2024", data2: "23/08/2024", data3: "12/06/2024", data4: "23/07/2024", data5: "23/06/2023", data6: "12/05/2022", data7: "12/05/2023", data6: "12/05/2023", data6: "20/12/2024", data7: "12/06/2024", data8: "12/05/2024", data9: "12/02/2024", data10: "23/07/2024", data11: "12/05/2024", data12: "12/05/2024", data13: "12/04/2024", data14: "12/04/2024", data15: "12/08/2024", data16: "12/09/2024", data17: "22/05/2024", data18: "12/09/2024", data19: "12/09/2022", data20: "12/05/2024", data21: "12/09/2023", data22: "12/08/2023" },
  { id: 4, propertyname: "DG- Tifton ,GA", data1: "12/09/2024", data2: "23/08/2024", data3: "12/06/2024", data4: "23/07/2024", data5: "23/06/2023", data6: "12/05/2022", data7: "12/05/2023", data6: "12/05/2023", data6: "20/12/2024", data7: "12/06/2024", data8: "12/05/2024", data9: "12/02/2024", data10: "23/07/2024", data11: "12/05/2024", data12: "12/05/2024", data13: "12/04/2024", data14: "12/04/2024", data15: "12/08/2024", data16: "12/09/2024", data17: "22/05/2024", data18: "12/09/2024", data19: "12/09/2022", data20: "12/05/2024", data21: "12/09/2023", data22: "12/08/2023" },
  { id: 5, propertyname: "DG- Tifton ,GA", data1: "12/09/2024", data2: "23/08/2024", data3: "12/06/2024", data4: "23/07/2024", data5: "23/06/2023", data6: "12/05/2022", data7: "12/05/2023", data6: "12/05/2023", data6: "20/12/2024", data7: "12/06/2024", data8: "12/05/2024", data9: "12/02/2024", data10: "23/07/2024", data11: "12/05/2024", data12: "12/05/2024", data13: "12/04/2024", data14: "12/04/2024", data15: "12/08/2024", data16: "12/09/2024", data17: "22/05/2024", data18: "12/09/2024", data19: "12/09/2022", data20: "12/05/2024", data21: "12/09/2023", data22: "12/08/2023" },
  { id: 6, propertyname: "DG- Tifton ,GA", data1: "12/09/2024", data2: "23/08/2024", data3: "12/06/2024", data4: "23/07/2024", data5: "23/06/2023", data6: "12/05/2022", data7: "12/05/2023", data6: "12/05/2023", data6: "20/12/2024", data7: "12/06/2024", data8: "12/05/2024", data9: "12/02/2024", data10: "23/07/2024", data11: "12/05/2024", data12: "12/05/2024", data13: "12/04/2024", data14: "12/04/2024", data15: "12/08/2024", data16: "12/09/2024", data17: "22/05/2024", data18: "12/09/2024", data19: "12/09/2022", data20: "12/05/2024", data21: "12/09/2023", data22: "12/08/2023" },
  { id: 7, propertyname: "DG- Tifton ,GA", data1: "12/09/2024", data2: "23/08/2024", data3: "12/06/2024", data4: "23/07/2024", data5: "23/06/2023", data6: "12/05/2022", data7: "12/05/2023", data6: "12/05/2023", data6: "20/12/2024", data7: "12/06/2024", data8: "12/05/2024", data9: "12/02/2024", data10: "23/07/2024", data11: "12/05/2024", data12: "12/05/2024", data13: "12/04/2024", data14: "12/04/2024", data15: "12/08/2024", data16: "12/09/2024", data17: "22/05/2024", data18: "12/09/2024", data19: "12/09/2022", data20: "12/05/2024", data21: "12/09/2023", data22: "12/08/2023" },
  { id: 8, propertyname: "DG- Tifton ,GA", data1: "12/09/2024", data2: "23/08/2024", data3: "12/06/2024", data4: "23/07/2024", data5: "23/06/2023", data6: "12/05/2022", data7: "12/05/2023", data6: "12/05/2023", data6: "20/12/2024", data7: "12/06/2024", data8: "12/05/2024", data9: "12/02/2024", data10: "23/07/2024", data11: "12/05/2024", data12: "12/05/2024", data13: "12/04/2024", data14: "12/04/2024", data15: "12/08/2024", data16: "12/09/2024", data17: "22/05/2024", data18: "12/09/2024", data19: "12/09/2022", data20: "12/05/2024", data21: "12/09/2023", data22: "12/08/2023" },
  { id: 9, propertyname: "DG- Tifton ,GA", data1: "12/09/2024", data2: "23/08/2024", data3: "12/06/2024", data4: "23/07/2024", data5: "23/06/2023", data6: "12/05/2022", data7: "12/05/2023", data6: "12/05/2023", data6: "20/12/2024", data7: "12/06/2024", data8: "12/05/2024", data9: "12/02/2024", data10: "23/07/2024", data11: "12/05/2024", data12: "12/05/2024", data13: "12/04/2024", data14: "12/04/2024", data15: "12/08/2024", data16: "12/09/2024", data17: "22/05/2024", data18: "12/09/2024", data19: "12/09/2022", data20: "12/05/2024", data21: "12/09/2023", data22: "12/08/2023" },
  { id: 10, propertyname: "DG- Tifton ,GA", data1: "12/09/2024", data2: "23/08/2024", data3: "12/06/2024", data4: "23/07/2024", data5: "23/06/2023", data6: "12/05/2022", data7: "12/05/2023", data6: "12/05/2023", data6: "20/12/2024", data7: "12/06/2024", data8: "12/05/2024", data9: "12/02/2024", data10: "23/07/2024", data11: "12/05/2024", data12: "12/05/2024", data13: "12/04/2024", data14: "12/04/2024", data15: "12/08/2024", data16: "12/09/2024", data17: "22/05/2024", data18: "12/09/2024", data19: "12/09/2022", data20: "12/05/2024", data21: "12/09/2023", data22: "12/08/2023" },
  { id: 11, propertyname: "DG- Tifton ,GA", data1: "12/09/2024", data2: "23/08/2024", data3: "12/06/2024", data4: "23/07/2024", data5: "23/06/2023", data6: "12/05/2022", data7: "12/05/2023", data6: "12/05/2023", data6: "20/12/2024", data7: "12/06/2024", data8: "12/05/2024", data9: "12/02/2024", data10: "23/07/2024", data11: "12/05/2024", data12: "12/05/2024", data13: "12/04/2024", data14: "12/04/2024", data15: "12/08/2024", data16: "12/09/2024", data17: "22/05/2024", data18: "12/09/2024", data19: "12/09/2022", data20: "12/05/2024", data21: "12/09/2023", data22: "12/08/2023" },
  { id: 12, propertyname: "DG- Tifton ,GA", data1: "12/09/2024", data2: "23/08/2024", data3: "12/06/2024", data4: "23/07/2024", data5: "23/06/2023", data6: "12/05/2022", data7: "12/05/2023", data6: "12/05/2023", data6: "20/12/2024", data7: "12/06/2024", data8: "12/05/2024", data9: "12/02/2024", data10: "23/07/2024", data11: "12/05/2024", data12: "12/05/2024", data13: "12/04/2024", data14: "12/04/2024", data15: "12/08/2024", data16: "12/09/2024", data17: "22/05/2024", data18: "12/09/2024", data19: "12/09/2022", data20: "12/05/2024", data21: "12/09/2023", data22: "12/08/2023" },
];

const ContractToClosed = () => {
  const [config] = useAuth();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [listData, setListData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [itemPerPage, setItemPerPage] = useState(10);
  const [sortBy, setSortBy] = useState("id");
  const [sortDirection, setSortDirection] = useState("asc");
  const isSidebarCollapsed = useSelector((state) => state.isSidebarCollapsed);
  // const [paginationData, setPaginationData] = useState({ totalItems: 0, from: 0, to: 0, totalPages: 0 });
  const [paginationData, setPaginationData] = useState({ totalItems: contactcloseData.length, from: 0, to: contactcloseData.length, totalPages: contactcloseData.length });

  const fetchData = () => {
    axios
      .get(`${BASE_URL}/contract-to-closed-listing?page=${currentPage}&per_page=${itemPerPage}&search=${search}&sort_direction=${sortDirection}&sort_by=${sortBy}`, config)
      .then((res) => {
        const value = res?.data?.contarct_to_close;
        setListData(value?.data || []);
        setPaginationData({
          totalItems: value?.total ?? 0,
          from: value?.from ?? 0,
          to: value?.to ?? 0,
          totalPages: value?.last_page ?? 0,
        });
        if (res?.data?.message) {
          NotificationManager.success(res?.data?.message);
        }
      })
      .catch((err) => {
        if (err.response?.data?.message && err.response?.data?.message !== "Too Many Attempts.") {
          NotificationManager.error(err.response?.data?.message);
        }
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    // fetchData();
  }, [sortDirection, sortBy]);

  useEffect(() => {
    // onSuccess();
  }, [search, currentPage, itemPerPage]);

  const onSuccess = () => {
    setLoading(true);
    fetchData();
  };

  const handleNext = () => {
    if (currentPage !== paginationData.totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrev = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <BaseLayout>
      <div className="contact-header">
        <p className="head-1 dark-H">Cotract to Closed</p>
        <div className="md:flex block gap-6 items-center">
          <div className="flex gap-6 justify-between items-center">
            <div className="search-box contacts">
              <input
                type="text"
                className="body-N"
                placeholder="Search name, address, city, state...."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                }}
                style={{ border: "1px solid #D8D8D8" }}
              />
              <span className="icon-search"></span>
            </div>
            <button className="add-contact-button green-bg-H light-L body-S">
              <img className="mr-2" src={Plus} alt="plus" /> Add
            </button>
          </div>
        </div>
      </div>

      <div className="light-bg-L pb-3 table-container">
        <div className={`${isSidebarCollapsed ? "collapsed-width" : "width"} table-info light-bg-L`}>
          {/* {loading ? (
                        <Loader />
                    ) : listData?.length === 0 ? (
                        <p className="body-N text-center mt-6 p-10">No Buyers Available</p>
                    ) : ( */}
          <table className="contact-table light-bg-L">
            <thead>
              <tr className="uppercase body-N dark-M">
                <th className="green-H ">
                  <div className="table-header">
                    Property
                    <img
                      role="button"
                      src={sortBy !== "property_name" ? swap : sortDirection === "desc" ? sortDesc : sortAsce}
                      onClick={() => {
                        setSortBy("property_name");
                        if (sortDirection === "desc") {
                          setSortDirection("asc");
                        } else {
                          setSortDirection("desc");
                        }
                      }}
                      alt="icon"
                    />
                  </div>
                </th>
                <th>
                  <div className="table-header">
                    Executed Loi
                    <img
                      role="button"
                      src={sortBy !== "executed_loi" ? swap : sortDirection === "desc" ? sortDesc : sortAsce}
                      onClick={() => {
                        setSortBy("executed_loi");
                        if (sortDirection === "desc") {
                          setSortDirection("asc");
                        } else {
                          setSortDirection("desc");
                        }
                      }}
                      alt="icon"
                    />
                  </div>
                </th>
                <th>
                  <div className="table-header">
                    Purchase Agreement
                    <br />
                    Draft Distributed
                    <img
                      role="button"
                      src={sortBy !== "purchase_agreement_draft_distributed" ? swap : sortDirection === "desc" ? sortDesc : sortAsce}
                      onClick={() => {
                        setSortBy("purchase_agreement_draft_distributed");
                        if (sortDirection === "desc") {
                          setSortDirection("asc");
                        } else {
                          setSortDirection("desc");
                        }
                      }}
                      alt="icon"
                    />
                  </div>
                </th>
                <th>
                  <div className="table-header">
                    Executed Purchase <br /> Agreeement
                    <img
                      role="button"
                      src={sortBy !== "executed_purchase_agreeement" ? swap : sortDirection === "desc" ? sortDesc : sortAsce}
                      onClick={() => {
                        setSortBy("executed_purchase_agreeement");
                        if (sortDirection === "desc") {
                          setSortDirection("asc");
                        } else {
                          setSortDirection("desc");
                        }
                      }}
                      alt="icon"
                    />
                  </div>
                </th>
                <th>
                  <div className="table-header">
                    Transaction Timeline <br /> Distributed
                    <img
                      role="button"
                      src={sortBy !== "transaction_timeline_distributed" ? swap : sortDirection === "desc" ? sortDesc : sortAsce}
                      onClick={() => {
                        setSortBy("transaction_timeline_distributed");
                        if (sortDirection === "desc") {
                          setSortDirection("asc");
                        } else {
                          setSortDirection("desc");
                        }
                      }}
                      alt="icon"
                    />
                  </div>
                </th>

                <th>
                  <div className="table-header">
                    Earnest Deposite <br /> Confirmed
                    <img
                      role="button"
                      src={sortBy !== "earnest_deposite_confirmed" ? swap : sortDirection === "desc" ? sortDesc : sortAsce}
                      onClick={() => {
                        setSortBy("earnest_deposite_confirmed");
                        if (sortDirection === "desc") {
                          setSortDirection("asc");
                        } else {
                          setSortDirection("desc");
                        }
                      }}
                      alt="icon"
                    />
                  </div>
                </th>

                <th>
                  <div className="table-header">
                    Due Diligence Delivery <br /> Receipt Confirmed
                    <img
                      role="button"
                      src={sortBy !== "due_diligence_delivery_receipt_confirmed" ? swap : sortDirection === "desc" ? sortDesc : sortAsce}
                      onClick={() => {
                        setSortBy("due_diligence_delivery_receipt_confirmed");
                        if (sortDirection === "desc") {
                          setSortDirection("asc");
                        } else {
                          setSortDirection("desc");
                        }
                      }}
                      alt="icon"
                    />
                  </div>
                </th>

                <th>
                  <div className="table-header">
                    Title
                    <img
                      role="button"
                      src={sortBy !== "title" ? swap : sortDirection === "desc" ? sortDesc : sortAsce}
                      onClick={() => {
                        setSortBy("title");
                        if (sortDirection === "desc") {
                          setSortDirection("asc");
                        } else {
                          setSortDirection("desc");
                        }
                      }}
                      alt="icon"
                    />
                  </div>
                </th>

                <th>
                  <div className="table-header">
                    Address <br /> Title Issues
                    <img
                      role="button"
                      src={sortBy !== "address_title_issues" ? swap : sortDirection === "desc" ? sortDesc : sortAsce}
                      onClick={() => {
                        setSortBy("address_title_issues");
                        if (sortDirection === "desc") {
                          setSortDirection("asc");
                        } else {
                          setSortDirection("desc");
                        }
                      }}
                      alt="icon"
                    />
                  </div>
                </th>

                <th>
                  <div className="table-header">
                    Cordinate <br /> Inspection
                    <img
                      role="button"
                      src={sortBy !== "cordinate_inspection" ? swap : sortDirection === "desc" ? sortDesc : sortAsce}
                      onClick={() => {
                        setSortBy("cordinate_inspection");
                        if (sortDirection === "desc") {
                          setSortDirection("asc");
                        } else {
                          setSortDirection("desc");
                        }
                      }}
                      alt="icon"
                    />
                  </div>
                </th>
                <th>
                  <div className="table-header">
                    Survey <br /> Received
                    <img
                      role="button"
                      src={sortBy !== "survey_received" ? swap : sortDirection === "desc" ? sortDesc : sortAsce}
                      onClick={() => {
                        setSortBy("survey_received");
                        if (sortDirection === "desc") {
                          setSortDirection("asc");
                        } else {
                          setSortDirection("desc");
                        }
                      }}
                      alt="icon"
                    />
                  </div>
                </th>
                <th>
                  <div className="table-header">
                    Environmental <br /> Report Received
                    <img
                      role="button"
                      src={sortBy !== "environmental_report_received" ? swap : sortDirection === "desc" ? sortDesc : sortAsce}
                      onClick={() => {
                        setSortBy("environmental_report_received");
                        if (sortDirection === "desc") {
                          setSortDirection("asc");
                        } else {
                          setSortDirection("desc");
                        }
                      }}
                      alt="icon"
                    />
                  </div>
                </th>
                <th>
                  <div className="table-header">
                    Appraisal <br /> Received
                    <img
                      role="button"
                      src={sortBy !== "appraisal_received" ? swap : sortDirection === "desc" ? sortDesc : sortAsce}
                      onClick={() => {
                        setSortBy("appraisal_received");
                        if (sortDirection === "desc") {
                          setSortDirection("asc");
                        } else {
                          setSortDirection("desc");
                        }
                      }}
                      alt="icon"
                    />
                  </div>
                </th>
                <th>
                  <div className="table-header">
                    Negotiate <br /> Repairs
                    <img
                      role="button"
                      src={sortBy !== "negotiate_repairs" ? swap : sortDirection === "desc" ? sortDesc : sortAsce}
                      onClick={() => {
                        setSortBy("negotiate_repairs");
                        if (sortDirection === "desc") {
                          setSortDirection("asc");
                        } else {
                          setSortDirection("desc");
                        }
                      }}
                      alt="icon"
                    />
                  </div>
                </th>
                <th>
                  <div className="table-header">
                    Due Diligence <br /> Expiration Date
                    <img
                      role="button"
                      src={sortBy !== "due_diligence_expiration_date" ? swap : sortDirection === "desc" ? sortDesc : sortAsce}
                      onClick={() => {
                        setSortBy("due_diligence_expiration_date");
                        if (sortDirection === "desc") {
                          setSortDirection("asc");
                        } else {
                          setSortDirection("desc");
                        }
                      }}
                      alt="icon"
                    />
                  </div>
                </th>
                <th>
                  <div className="table-header">
                    Estoppel <br /> Snda Ordered
                    <img
                      role="button"
                      src={sortBy !== "estoppel_snda_ordered" ? swap : sortDirection === "desc" ? sortDesc : sortAsce}
                      onClick={() => {
                        setSortBy("estoppel_snda_ordered");
                        if (sortDirection === "desc") {
                          setSortDirection("asc");
                        } else {
                          setSortDirection("desc");
                        }
                      }}
                      alt="icon"
                    />
                  </div>
                </th>
                <th>
                  <div className="table-header">
                    Financing <br /> Approval
                    <img
                      role="button"
                      src={sortBy !== "financing_approval" ? swap : sortDirection === "desc" ? sortDesc : sortAsce}
                      onClick={() => {
                        setSortBy("financing_approval");
                        if (sortDirection === "desc") {
                          setSortDirection("asc");
                        } else {
                          setSortDirection("desc");
                        }
                      }}
                      alt="icon"
                    />
                  </div>
                </th>
                <th>
                  <div className="table-header">
                    Building <br /> Insurance Obtained
                    <img
                      role="button"
                      src={sortBy !== "building_insurance_obtained" ? swap : sortDirection === "desc" ? sortDesc : sortAsce}
                      onClick={() => {
                        setSortBy("building_insurance_obtained");
                        if (sortDirection === "desc") {
                          setSortDirection("asc");
                        } else {
                          setSortDirection("desc");
                        }
                      }}
                      alt="icon"
                    />
                  </div>
                </th>
                <th>
                  <div className="table-header">
                    Estoppel & <br /> Snda Received
                    <img
                      role="button"
                      src={sortBy !== "estoppel_snda_received" ? swap : sortDirection === "desc" ? sortDesc : sortAsce}
                      onClick={() => {
                        setSortBy("estoppel_snda_received");
                        if (sortDirection === "desc") {
                          setSortDirection("asc");
                        } else {
                          setSortDirection("desc");
                        }
                      }}
                      alt="icon"
                    />
                  </div>
                </th>
                <th>
                  <div className="table-header">
                    Scheduled & <br /> Closing
                    <img
                      role="button"
                      src={sortBy !== "scheduled_closing" ? swap : sortDirection === "desc" ? sortDesc : sortAsce}
                      onClick={() => {
                        setSortBy("scheduled_closing");
                        if (sortDirection === "desc") {
                          setSortDirection("asc");
                        } else {
                          setSortDirection("desc");
                        }
                      }}
                      alt="icon"
                    />
                  </div>
                </th>
                <th>
                  <div className="table-header">
                    Comission Invoice & <br /> Wiring Instruction
                    <img
                      role="button"
                      src={sortBy !== "comission_invoice_wiring_instruction" ? swap : sortDirection === "desc" ? sortDesc : sortAsce}
                      onClick={() => {
                        setSortBy("comission_invoice_wiring_instruction");
                        if (sortDirection === "desc") {
                          setSortDirection("asc");
                        } else {
                          setSortDirection("desc");
                        }
                      }}
                      alt="icon"
                    />
                  </div>
                </th>
                <th>
                  <div className="table-header">
                    Review Settlement <br />& Statement
                    <img
                      role="button"
                      src={sortBy !== "review_settlement_statement" ? swap : sortDirection === "desc" ? sortDesc : sortAsce}
                      onClick={() => {
                        setSortBy("review_settlement_statement");
                        if (sortDirection === "desc") {
                          setSortDirection("asc");
                        } else {
                          setSortDirection("desc");
                        }
                      }}
                      alt="icon"
                    />
                  </div>
                </th>
                <th>
                  <div className="table-header">
                    Closed
                    <img
                      role="button"
                      src={sortBy !== "closed" ? swap : sortDirection === "desc" ? sortDesc : sortAsce}
                      onClick={() => {
                        setSortBy("closed");
                        if (sortDirection === "desc") {
                          setSortDirection("asc");
                        } else {
                          setSortDirection("desc");
                        }
                      }}
                      alt="icon"
                    />
                  </div>
                </th>
              </tr>
            </thead>

            <tbody>
              {contactcloseData.map((el, idx) => (
                <tr key={idx} className="dark-M body-N">
                  <td className="head-4 dark-H">
                    {el.propertyname}
                    {/* {moment(el?.created_at).format("MM/DD/YY")} */}
                  </td>
                  <td>{el.data1}</td>
                  <td>{el.data2}</td>
                  <td>{el.data3}</td>
                  <td>{el.data4}</td>
                  <td>{el.data5}</td>
                  <td>{el.data6}</td>
                  <td>{el.data7}</td>
                  <td>{el.data8}</td>
                  <td>{el.data9}</td>
                  <td>{el.data10}</td>
                  <td>{el.data11}</td>
                  <td>{el.data12}</td>
                  <td>{el.data13}</td>
                  <td>{el.data14}</td>
                  <td>{el.data15}</td>
                  <td>{el.data16}</td>
                  <td>{el.data17}</td>
                  <td>{el.data18}</td>
                  <td>{el.data19}</td>
                  <td>{el.data20}</td>
                  <td>{el.data21}</td>
                  <td>{el.data22}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {/* )} */}
        </div>

        <ContactPagination paginationData={paginationData} handleNext={handleNext} handlePrev={handlePrev} onSuccess={onSuccess} />
      </div>
    </BaseLayout>
  );
};

export default ContractToClosed;
