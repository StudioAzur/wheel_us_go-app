import React, { useContext } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import {
	ConnectionPage,
	PremiumPage,
	ProfilePage,
	ReglagesPage,
	SearchUser,
	UserFriends,
	UserMessages,
	UserRooms
} from "./pages";
import ProtectedRoute from "./router/ProtectedRoute";
import { AuthContext } from "./context/AuthContext";
import AuthProtectedRoute from "./router/AuthProtectedRoute";
import ViewRoom from "./pages/viewRoom/ViewRoom";

function App() {
	const { state } = useContext(AuthContext);

	return (
		<BrowserRouter>
			<Routes>
				<Route
					path="/"
					element={
						<AuthProtectedRoute user={state.user}>
							<ConnectionPage />
						</AuthProtectedRoute>
					}
				/>
				<Route element={<ProtectedRoute user={state.user} />}>
					<Route path="/profile" element={<ProfilePage />} />
					<Route path="/searchuser" element={<SearchUser />} />
					<Route path="/userrooms" element={<UserRooms />} />
					<Route path="/usermessages" element={<UserMessages />} />
					<Route path="/userfriends" element={<UserFriends />} />
					<Route path="/premium" element={<PremiumPage />} />
					<Route path="/reglages" element={<ReglagesPage />} />
					<Route path="/viewroom" element={<ViewRoom/>}/>
				</Route>
			</Routes>
		</BrowserRouter>
	);
}

export default App;
