import React, { useEffect, useState } from "react";
import { Link, withRouter, Redirect } from "react-router-dom";
import { signin, authenticate, isAuthenticated } from "auth/index";
import axios from "axios";

function BazakNavbarTitle(props) {
	return <h1>מערכת גיוס מילואים</h1>;
}

export default withRouter(BazakNavbarTitle);
