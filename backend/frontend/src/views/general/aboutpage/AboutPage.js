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
import bazakodot from 'assets/img/bazakodot.png'
import bazakodot_white from 'assets/img/bazakodot_white.png'
import manual from 'assets/manual/manualExample.pdf'

function AboutPage({ match, theme }) {

  return (
    <div style={{textAlign:'center' }}>
        {theme == 'white-content' ? <img src={bazakodot} style={{height:'1200px'}}></img>
              : <img src={bazakodot_white} style={{height:'1200px'}}></img>}
      <div style={{marginTop:'-100px'}}>
        <h1 style={{fontWeight: 'bold'}}>מדריך למשתמש:</h1>
        <a href={manual} download='manual.pdf'>
        <Button style={{fontSize: '24px'}}>הורדה</Button>
        </a>
      </div>
    </div>
  );
}

export default withRouter(AboutPage);