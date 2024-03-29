import { ColumnFilter } from "./ColumnFilter";
export const COLUMNS = [
  {
    Header: "מספר אישי",
    Footer: "מספר אישי",
    accessor: "personalnumber",
    Filter: ColumnFilter,
  },
  {
    Header: "שם",
    Footer: "שם",
    accessor: "name",
    Filter: ColumnFilter,
  },
  {
    Header: "שם משפחה",
    Footer: "שם משפחה",
    accessor: "lastname",
    Filter: ColumnFilter,
  },
  {
    Header: "הרשאה",
    Footer: "הרשאה",
    accessor: "role",
    Filter: ColumnFilter,
  },
  {
    Header: "פיקוד",
    Footer: "פיקוד",
    accessor: "unit",
    Filter: ColumnFilter,
  },
  {
    Header: "נוצר בתאריך",
    Footer: "נוצר בתאריך",
    accessor: "createdAt",
    Filter: ColumnFilter,
  },
  {
    Header: "עודכן בתאריך",
    Footer: "עודכן בתאריך",
    accessor: "updatedAt",
    Filter: ColumnFilter,
  },
];
