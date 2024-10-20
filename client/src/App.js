import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

/** Import All Components*/
import Register from "./components/register/Register";
import UserName from "./components/userName/UserName";
import Password from "./components/password/Password";
import Reset from "./components/reset/Reset";
import Recovery from "./components/recovery/Recovery";
import Profile from "./components/profile/Profile";
import PageNotFound from "./components/pageNotFound/PageNotFound";

// auth middleware
import { AuthorizeUser, ProtectRoute } from "./middleware/auth";

/** root routes */
const router = createBrowserRouter([
  {
    path: "/",
    element: <UserName />,
  },
  {
    path: "/register",
    element: <Register />,
  },

  {
    path: "/password",
    element: (
      <ProtectRoute>
        <Password />
      </ProtectRoute>
    ),
  },

  {
    path: "/reset",
    element: <Reset />,
  },

  {
    path: "/recovery",
    element: <Recovery />,
  },

  {
    path: "/profile",
    element: (
      <AuthorizeUser>
        <Profile />
      </AuthorizeUser>
    ),
  },

  {
    path: "*",
    element: <PageNotFound />,
  },
]);

const App = () => {
  return (
    <main>
      <RouterProvider router={router} />
    </main>
  );
};

export default App;
