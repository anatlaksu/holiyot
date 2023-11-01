import { ColumnFilter } from "./ColumnFilter";

export const COLUMNS = [
  {
    Header: 'מס"ד',
    accessor: "msd",
    Filter: ColumnFilter,
  },
  // {
  //   Header: "פיקוד דורש",
  //   accessor: "body_requires",
  //   Filter: ColumnFilter,
  // },
  {
    Header: "יחידה דורשת",
    accessor: "unit_requires",
    Filter: ColumnFilter,
  },
  {
    Header: 'סוג האמל"ח',
    accessor: "amlah",
    Filter: ColumnFilter,
  },
  {
    Header: 'מרחב האמל"ח',
    accessor: "merhav_amlah",
    Filter: ColumnFilter,
  },
  {
    Header: "סוג התקלה",
    accessor: "type_happend",
    Filter: ColumnFilter,
  },
  {
    Header: "מקור החוליה",
    accessor: "source_holi",
    Filter: ColumnFilter,
  },
  {
    Header: "סוג הכיתה",
    accessor: "class",
    Filter: ColumnFilter,
  },
  {
    Header: "סטטוס",
    accessor: "status",
    Filter: ColumnFilter,
  },
  {
    Header: "מועד רצוי להוצאת ההחוליה",
    accessor: "date_need",
    Filter: ColumnFilter,
  },
];
