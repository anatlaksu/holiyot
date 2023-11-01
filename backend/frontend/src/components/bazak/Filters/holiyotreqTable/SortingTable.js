import { authenticate, isAuthenticated, signin } from "auth/index";
import axios from "axios";
import React, { useEffect, useMemo, useRef, useState } from "react";
import ReactHTMLTableToExcel from "react-html-table-to-excel";
import { Link, Redirect, withRouter } from "react-router-dom";
import PropagateLoader from "react-spinners/PropagateLoader";
import {
  useFilters,
  useGlobalFilter,
  usePagination,
  useSortBy,
  useTable,
} from "react-table";
import { Col, Input, Row } from "reactstrap";
import CarDataFormModal from "views/general/holiyot/CarDataFormModal";
import CarDataFormModalDelete from "views/general/holiyot/CarDataFormModalDelete";
import { GlobalFilter } from "./GlobalFilter";
import styles from "./SortingTable.module.css";
import { COLUMNS } from "./coulmns";

//redux

const SortingTable = (props) => {
  //user
  const { user } = isAuthenticated();
  //table
  const columns = useMemo(() => COLUMNS, []);
  //data
  const [data, setData] = useState([]);
  const [originaldata, setOriginaldata] = useState([]);
  // sysytems //! might cange the way we save this kind of data later depends if we want to fillter with the main fillter
  const [systemsonZ, setSystemonsonZ] = useState({});
  const [systems, setSystems] = useState([]);
  //filter
  const [filter, setFilter] = useState([]);
  //cardata form modal
  const [iscardataformopen, setIscardataformopen] = useState(false);
  const [cardataidformodal, setCardataidformodal] = useState(undefined);
  //cardata form modal delete
  const [iscardataformdeleteopen, setIscardataformdeleteopen] = useState(false);
  const [cardataidfordeletemodal, setCardataidfordeletemodal] =
    useState(undefined);
  //spinner
  const [isdataloaded, setIsdataloaded] = useState(false);
  //excel download
  const XLSX = require("xlsx");

  // unit
  const [unit, setUnit] = useState([]);
  const [job, setJob] = useState([]);
  const [subject, setSubject] = useState([]);

  function Toggle(evt) {
    if (evt.currentTarget.value == "") {
      setCardataidformodal(undefined);
    } else {
      setCardataidformodal(evt.currentTarget.value);
    }
    setIscardataformopen(!iscardataformopen);
  }

  function ToggleForModal(evt) {
    setIscardataformopen(!iscardataformopen);
  }

  function ToggleDelete(evt) {
    if (evt.currentTarget.value == "") {
      setCardataidfordeletemodal(undefined);
    } else {
      setCardataidfordeletemodal(evt.currentTarget.value);
    }
    setIscardataformdeleteopen(!iscardataformdeleteopen);
  }

  function ToggleForModalDelete(evt) {
    setIscardataformdeleteopen(!iscardataformdeleteopen);
  }

  // ------------- בארמי לבדוק שהשדות בקולקשיין באותו השם כמו בפונקציה הנ"ל!! -----------
  function getname(idnum, arr) {
    for (let i = 0; i < arr.length; i++) {
      if (arr[i]._id == idnum) return arr[i].name;
    }
  }

  async function CalculateDataArr() {
    if (user.role === "3") {
      await axios
        .get(`http://localhost:8000/api/report/holi/approved/${user.holiya}`)
        .then((response) => {
          setData(response.data);
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      await axios
        .get(`http://localhost:8000/api/report`)
        .then((response) => {
          setData(response.data);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }

  const getUnit = async () => {
    await axios
      .get("http://localhost:8000/api/units")
      .then((response) => {
        setUnit(response.data);
        // console.log(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  function init() {
    CalculateDataArr();
  }

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    footerGroups,
    page,
    prepareRow,
    allColumns,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize, globalFilter, hiddenColumns },
    setGlobalFilter,
  } = useTable(
    {
      columns,
      data,
      initialState: {
        pageIndex: 0,
      },
    },
    useGlobalFilter,
    useFilters,
    useSortBy,
    usePagination
  );

  // ------------------ excel function -----------------------------------------------
  // function FixDataAndExportToExcel() {
  // 	let tempdata_to_excel = [];
  // 	for (let i = 0; i < data.length; i++) {
  // 		tempdata_to_excel.push({ ...data[i] });
  // 	}

  // 	for (let i = 0; i < tempdata_to_excel.length; i++) {
  // 		tempdata_to_excel[i].name
  // 			? (tempdata_to_excel[i].name_m = tempdata_to_excel[i].name)
  // 			: (tempdata_to_excel[i].name_m = " ");
  // 		tempdata_to_excel[i].family
  // 			? (tempdata_to_excel[i].lastname = tempdata_to_excel[i].family)
  // 			: (tempdata_to_excel[i].lastname = " ");
  // 		tempdata_to_excel[i].pesonal_number
  // 			? (tempdata_to_excel[i].personalnumber =
  // 					tempdata_to_excel[i].pesonal_number)
  // 			: (tempdata_to_excel[i].personalnumber = " ");
  // 		tempdata_to_excel[i].ta
  // 			? (tempdata_to_excel[i].ta_m = tempdata_to_excel[i].ta)
  // 			: (tempdata_to_excel[i].ta_m = " ");

  // 		tempdata_to_excel[i].present
  // 			? (tempdata_to_excel[i].present_m = "כן")
  // 			: (tempdata_to_excel[i].present_m = "לא");
  // 		tempdata_to_excel[i].todayPresent
  // 			? (tempdata_to_excel[i].todayPresent_m = "כן")
  // 			: (tempdata_to_excel[i].todayPresent_m = "לא");
  // 		tempdata_to_excel[i].dailSent
  // 			? (tempdata_to_excel[i].dailSent_m = "כן")
  // 			: (tempdata_to_excel[i].dailSent_m = "לא");
  // 		tempdata_to_excel[i].shamapOpen
  // 			? (tempdata_to_excel[i].shamapOpen_m = "כן")
  // 			: (tempdata_to_excel[i].shamapOpen_m = "לא");

  // 		tempdata_to_excel[i].unit
  // 			? (tempdata_to_excel[i].unit_m = getname(
  // 					tempdata_to_excel[i].unit,
  // 					unit
  // 			  ))
  // 			: (tempdata_to_excel[i].unit_m = " ");
  // 		tempdata_to_excel[i].job
  // 			? (tempdata_to_excel[i].job_m = getname(tempdata_to_excel[i].job, job))
  // 			: (tempdata_to_excel[i].job_m = " ");

  // 		// ------------------------ בארמי במקום השורה הזאת ----------------------------------------
  // 		tempdata_to_excel[i].subject
  // 			? (tempdata_to_excel[i].subject_m = tempdata_to_excel[i].subject)
  // 			: (tempdata_to_excel[i].subject_m = " ");
  // 		//   ----------------------- לעשות את השורה הזאת ----------------------------------
  // 		//   tempdata_to_excel[i].subject ? tempdata_to_excel[i].subject_m = getname(tempdata_to_excel[i].subject, subject) : tempdata_to_excel[i].subject_m = " ";
  // 		// -----------------------------------------------------------------------------------------
  // 	}

  // 	//export to excel -fix
  // 	for (let i = 0; i < tempdata_to_excel.length; i++) {
  // 		//delete unwanted fields
  // 		delete tempdata_to_excel[i]._id;
  // 		delete tempdata_to_excel[i].present;
  // 		delete tempdata_to_excel[i].todayPresent;
  // 		delete tempdata_to_excel[i].dailSent;
  // 		delete tempdata_to_excel[i].shamapOpen;
  // 		delete tempdata_to_excel[i].name;
  // 		delete tempdata_to_excel[i].family;
  // 		delete tempdata_to_excel[i].unit;
  // 		delete tempdata_to_excel[i].subject;
  // 		delete tempdata_to_excel[i].pesonal_number;
  // 		delete tempdata_to_excel[i].details;
  // 		delete tempdata_to_excel[i].__v;
  // 		delete tempdata_to_excel[i].civilian_number;
  // 		delete tempdata_to_excel[i].TodayPresent;
  // 		delete tempdata_to_excel[i].createdAt;
  // 		delete tempdata_to_excel[i].updatedAt;
  // 		delete tempdata_to_excel[i].ta;
  // 		delete tempdata_to_excel[i].job;

  // 		//add non-existing fields - 8
  // 		if (!tempdata_to_excel[i].name_m) {
  // 			tempdata_to_excel[i].name_m = " ";
  // 		}
  // 		if (!tempdata_to_excel[i].lastname) {
  // 			tempdata_to_excel[i].lastname = " ";
  // 		}
  // 		if (!tempdata_to_excel[i].personalnumber) {
  // 			tempdata_to_excel[i].hativa_name = " ";
  // 		}

  // 		if (!tempdata_to_excel[i].unit_m) {
  // 			tempdata_to_excel[i].unit_m = " ";
  // 		}
  // 		if (!tempdata_to_excel[i].subject_m) {
  // 			tempdata_to_excel[i].subject_m = " ";
  // 		}
  // 		if (!tempdata_to_excel[i].details_m) {
  // 			tempdata_to_excel[i].details_m = " ";
  // 		}
  // 		if (!tempdata_to_excel[i].job_m) {
  // 			tempdata_to_excel[i].job_m = " ";
  // 		}
  // 		if (!tempdata_to_excel[i].ta_m) {
  // 			tempdata_to_excel[i].ta_m = " ";
  // 		}
  // 	}

  // 	console.log(tempdata_to_excel);

  // 	const currentDate = new Date();
  // 	const month = (currentDate.getMonth() + 1).toString().padStart(2, "0");
  // 	const day = currentDate.getDate().toString().padStart(2, "0");

  // 	let EXCEL_EXTENSION = ".xlsx";
  // 	let worksheet = XLSX.WorkSheet;
  // 	let sheetName = "התייצבות מילואים " + day + "." + month;

  // 	const headers = {
  // 		name_m: "שם",
  // 		lastname: "שם משפחה",
  // 		personalnumber: "מספר אישי",
  // 		present_m: "התייצב",
  // 		todayPresent_m: "התייצב היום",
  // 		dailSent_m: "נשלח חייגן",
  // 		shamapOpen_m: 'נפתח שמ"פ',
  // 		unit_m: "יחידה",
  // 		subject_m: "מקצוע",
  // 		job_m: "תפקיד",
  // 		ta_m: "תא",
  // 	};
  // 	tempdata_to_excel.unshift(headers); // if custom header, then make sure first row of data is custom header

  // 	worksheet = XLSX.utils.json_to_sheet(tempdata_to_excel, {
  // 		skipHeader: true,
  // 	});

  // 	const workbook = XLSX.utils.book_new();
  // 	const fileName = "התייצבות מילואים " + day + "." + month + EXCEL_EXTENSION;
  // 	XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
  // 	XLSX.writeFile(workbook, fileName);

  // 	window.location.reload();
  // }

  //window
  const [windowSize, setWindowSize] = useState(getWindowSize());

  function getWindowSize() {
    const { innerWidth, innerHeight } = window;
    return { innerWidth, innerHeight };
  }

  useEffect(() => {
    init();
    getUnit();
  }, []);

  const getColorStatus = (status) => {
    if (status == "חדש") return "blue";
    else if (status == 'ממתין לאישור  תחום כשירות מסגרות הטנ"א')
      return "yellow";
    else if (status == 'ממתין לאישור מכלול טנ"א') return "green";
    else if (status == "נדחה") return "red";
    else return "black";
  };

  return (
    <>
      {/* <div style={{ float: "right", paddingBottom: "5px" }}>
				<button className="btn-green" onClick={FixDataAndExportToExcel}>
					הורד כקובץ אקסל
				</button>
			</div> */}

      <div style={{ textAlign: "right", marginTop: "5%" }}>
        <GlobalFilter filter={globalFilter} setFilter={setGlobalFilter} />
      </div>
      <button
        className="btn-new-blue"
        value={undefined}
        onClick={Toggle}
        style={{ marginRight: "5px" }}
      >
        בקשה לחוליה
      </button>
      {/* modals */}
      <CarDataFormModal
        isOpen={iscardataformopen}
        cardataid={cardataidformodal}
        Toggle={Toggle}
        ToggleForModal={ToggleForModal}
        unittype={props.unittype}
        unitid={props.unitid}
      />
      {/* <CarDataFormModalDelete
				isOpen={iscardataformdeleteopen}
				cardataid={cardataidfordeletemodal}
				Toggle={ToggleDelete}
				ToggleForModal={ToggleForModalDelete}
				unittype={props.unittype}
				unitid={props.unitid}
			/> */}

      <div
        className="table-responsive"
        style={{ overflow: "auto", height: windowSize.innerHeight * 0.9 }}
      >
        {/*filter */}

        <table id="table-to-xls-MiluimSortingTable" {...getTableProps()}>
          <thead>
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <th style={{ position: "sticky", top: "-2px" }}>
                    <div
                      {...column.getHeaderProps(column.getSortByToggleProps())}
                    >
                      {" "}
                      {column.render("Header")}{" "}
                    </div>
                    <div>
                      {column.canFilter ? column.render("Filter") : null}
                    </div>
                    <div>
                      {column.isSorted
                        ? column.isSortedDesc
                          ? "🔽"
                          : "⬆️"
                        : ""}
                    </div>
                  </th>
                ))}
                <th>עדכן</th>
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {page.map((row) => {
              prepareRow(row);
              return (
                <tr className="">
                  {row.cells.map((cell) => {
                    if (cell.column.id == "msd") {
                      return (
                        <td>
                          <div
                            style={{
                              width: "100%",
                              height: "40px",
                              margin: "0",
                              padding: "0",
                              overflow: "auto",
                            }}
                          >
                            {cell.value}
                          </div>
                        </td>
                      );
                    }
                    if (cell.column.id == "body_requires") {
                      return (
                        <td>
                          <div
                            style={{
                              width: "100%",
                              height: "40px",
                              margin: "0",
                              padding: "0",
                              overflow: "auto",
                            }}
                          >
                            {getname(cell.value, unit)}
                          </div>
                        </td>
                      );
                    }
                    if (cell.column.id == "unit_requires") {
                      return (
                        <td>
                          <div
                            style={{
                              width: "100%",
                              height: "40px",
                              margin: "0",
                              padding: "0",
                              overflow: "auto",
                            }}
                          >
                            {cell.value}
                          </div>
                        </td>
                      );
                    }
                    if (cell.column.id == "amlah") {
                      return (
                        <td>
                          <div
                            style={{
                              width: "100%",
                              height: "40px",
                              margin: "0",
                              padding: "0",
                              overflow: "auto",
                            }}
                          >
                            {cell.value}
                          </div>
                        </td>
                      );
                    }
                    if (cell.column.id == "merhav_amlah") {
                      return (
                        <td>
                          <div
                            style={{
                              width: "100%",
                              height: "40px",
                              margin: "0",
                              padding: "0",
                              overflow: "auto",
                            }}
                          >
                            {cell.value}
                          </div>
                        </td>
                      );
                    }
                    if (cell.column.id == "type_happend") {
                      return (
                        <td>
                          <div
                            style={{
                              width: "100%",
                              height: "40px",
                              margin: "0",
                              padding: "0",
                              overflow: "auto",
                            }}
                          >
                            {cell.value}
                          </div>
                        </td>
                      );
                    }
                    if (cell.column.id == "source_holi") {
                      return (
                        <td>
                          <div
                            style={{
                              width: "100%",
                              height: "40px",
                              margin: "0",
                              padding: "0",
                              overflow: "auto",
                            }}
                          >
                            {cell.value}
                          </div>
                        </td>
                      );
                    }
                    if (cell.column.id == "class") {
                      return (
                        <td>
                          <div
                            style={{
                              width: "100%",
                              height: "40px",
                              margin: "0",
                              padding: "0",
                              overflow: "auto",
                            }}
                          >
                            {cell.value}
                          </div>
                        </td>
                      );
                    }
                    if (cell.column.id == "status") {
                      return (
                        <td>
                          <div
                            style={{
                              width: "100%",
                              height: "40px",
                              margin: "0",
                              padding: "0",
                              overflow: "auto",
                              color: getColorStatus(cell.value),
                            }}
                          >
                            {cell.value}
                          </div>
                        </td>
                      );
                    }
                    if (cell.column.id == "date_need") {
                      return (
                        <td>
                          <div
                            style={{
                              width: "100%",
                              height: "40px",
                              margin: "0",
                              padding: "0",
                              overflow: "auto",
                            }}
                          >
                            {cell.value?.split("T")[0]}
                          </div>
                        </td>
                      );
                    }
                  })}
                  <td role="cell">
                    {" "}
                    <div
                      style={{
                        width: `${100 / 7}%`,
                        minWidth: "50px",
                        maxWidth: "100px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <button
                        className="btn-new-blue"
                        value={row.original._id}
                        onClick={Toggle}
                      >
                        עדכן
                      </button>
                    </div>
                  </td>
                  {/* <td role="cell">
										{" "}
										<div
											style={{
												width: `${100 / 7}%`,
												minWidth: "50px",
												maxWidth: "100px",
												display: "flex",
												alignItems: "center",
												justifyContent: "center",
											}}
										>
											<button
												className="btn-new-delete"
												value={row.original._id}
												onClick={ToggleDelete}
											>
												מחק
											</button>
										</div>
									</td> */}
                </tr>
              );
            })}
          </tbody>
        </table>
        <div className="pagination">
          <button onClick={() => previousPage()} disabled={!canPreviousPage}>
            {"<"}
          </button>{" "}
          <button onClick={() => nextPage()} disabled={!canNextPage}>
            {">"}
          </button>{" "}
          <span>
            עמוד{" "}
            <strong>
              {pageIndex + 1} מתוך {pageOptions.length}
            </strong>{" "}
          </span>
          <span>
            | חפש עמוד:{" "}
            <input
              type="number"
              defaultValue={pageIndex + 1}
              onChange={(e) => {
                const page = e.target.value ? Number(e.target.value) - 1 : 0;
                gotoPage(page);
              }}
              style={{ width: "100px", borderRadius: "10px" }}
            />
          </span>{" "}
          <select
            style={{ borderRadius: "10px" }}
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
            }}
          >
            {[5, 10, 15, 20, 25].map((pageSize) => (
              <option key={pageSize} value={pageSize}>
                הראה {pageSize}
              </option>
            ))}
            <option key={data.length} value={data.length}>
              הראה הכל
            </option>
          </select>
        </div>
      </div>
    </>
  );
};
export default withRouter(SortingTable);
