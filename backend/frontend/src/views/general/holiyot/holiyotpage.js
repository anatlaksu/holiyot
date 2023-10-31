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

function Holipage({ match }) {

  return (
    <>
      <h1>כאן יהיה טבלת בקשות חוליה </h1>     {/*spinner in table*/}
    </>
  );
}

export default withRouter(Holipage);