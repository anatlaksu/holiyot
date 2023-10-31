import React, { useState, useEffect, useRef } from 'react';

import { Link, withRouter, Redirect } from "react-router-dom";

// reactstrap components
import {
  Button,
  ButtonGroup,
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  Row,
  Container,
  Col,
  Collapse,
} from "reactstrap";
import axios from 'axios';
import { signin, authenticate, isAuthenticated } from 'auth/index';

import HoliyotReportTable from 'components/bazak/Filters/holiyotReportTable/SortingTable.js';

function Holireport({ match }) {

  return (
    <>
      <HoliyotReportTable />     {/*spinner in table*/}
    </>
  );
}

export default withRouter(Holireport);