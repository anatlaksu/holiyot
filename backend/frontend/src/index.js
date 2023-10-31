import React from "react";
import ReactDOM from "react-dom";
import {
	BrowserRouter,
	Router,
	Route,
	Switch,
	Redirect,
	withRouter,
} from "react-router-dom";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "assets/css/Table.css";
import "assets/css/TableDark.css";
import "assets/css/ExcelButton.css";
import "assets/css/EmptyButton.css";
import "assets/css/NewButton.css";
import "assets/css/NewButtonBlue.css";
import "assets/css/NewButtonDelete.css";
import "assets/css/black-dashboard-react.css";
import ThemeContextWrapper from "./components/general/ThemeWrapper/ThemeWrapper";
import BackgroundColorWrapper from "./components/general/BackgroundColorWrapper/BackgroundColorWrapper";

import history from "./history";

import LoggedinRoute from "auth/LoggedinRoute";
import UnloggedinRoute from "auth/UnloggedinRoute";
import AdminRoute from "auth/AdminRoute.js";
//redux
import { Provider } from "react-redux";
import store from "redux/store";

//auth routes
import SignIn from "views/authentication/SignInForm";
import AdminSignIn from "views/authentication/AdminSignInForm";
import SignUp from "views/authentication/SignUpForm";
import SignUpOtherUsers from "views/authentication/SignUpOtherUsers";
import ManageUsers from "views/authentication/manageusers/ManageUsers";
import EditUser from "views/authentication/EditUserForm";
//general routes
import DashboardPage from "views/general/dashboardpage/DashboardPage";
import UnitTreePage from "views/general/unittreepage/UnitTreePage";
import AboutPage from "views/general/aboutpage/AboutPage";
import StatisticsPage from "views/general/statisticspage/StatisticsPage";
import Holipage from "views/general/holiyot/holiyotpage";
import Holireport from "views/general/holiyot/holiyotreport"

ReactDOM.render(
	<>
		<Provider store={store}>
			<ThemeContextWrapper>
				<ToastContainer rtl autoClose={4000} style={{ textAlign: "right" }} />
				<BackgroundColorWrapper>
					<Router history={history}>
						<Switch>
							{/*///////////////////////////////////////////UnLoggedIn Routes/////////////////////////////////////////////////*/}
							<UnloggedinRoute path="/signin" exact component={SignIn} />
							<UnloggedinRoute
								path="/adminsignin"
								exact
								component={AdminSignIn}
							/>
							<UnloggedinRoute path="/signup" exact component={SignUp} />
							<LoggedinRoute
								path="/signupotherusers"
								exact
								component={SignUpOtherUsers}
							/>
							{/*///////////////////////////////////////////UnLoggedIn Routes/////////////////////////////////////////////////*/}

							{/*///////////////////////////////////////////Admin Routes/////////////////////////////////////////////////*/}
							<AdminRoute path="/manageusers" exact component={ManageUsers} />
							<AdminRoute path="/edituser/:userid" exact component={EditUser} />
							{/*///////////////////////////////////////////Admin Routes/////////////////////////////////////////////////*/}

							{/*///////////////////////////////////////////LoggedIn Routes/////////////////////////////////////////////////*/}
							{/* <LoggedinRoute path="/about" exact component={AboutPage} /> */}
							{/* <LoggedinRoute
								path="/unittreepage/:unittype/:unitid"
								exact
								component={UnitTreePage}
							/> */}
							<LoggedinRoute
								path="/dashboard/"
								exact
								component={DashboardPage}
							/>
							<LoggedinRoute
								path="/holipage"
								exact
								component={Holipage}
							/>
							<LoggedinRoute
								path="/holireport"
								exact
								component={Holireport}
							/>

							{/* <LoggedinRoute
								path="/statisticspage"
								exact
								component={StatisticsPage}
							/> */}
							{/*///////////////////////////////////////////LoggedIn Routes/////////////////////////////////////////////////*/}
							<Redirect from="/" to="/signin" />
						</Switch>
					</Router>
				</BackgroundColorWrapper>
			</ThemeContextWrapper>
		</Provider>
	</>,
	document.getElementById("root")
);
