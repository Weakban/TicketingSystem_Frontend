import { createBrowserRouter } from "react-router-dom";
import App from "./App.tsx";
import Dashboard from "./pages/Dashboard.tsx";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Dashboard />,
    children: [
        {index: true, element: <h1>Home</h1>},
    ]
  },

  {path:"/app", element: <App/>,
    children:[
        {path:"dashboard", element: <h1>Dashboard</h1>},
    ]
  }

]);



/*
 {path:"/app", element: <RequireAuth/>,
    children:[
        {path:"dashboard", element: <h1>Dashboard</h1>},
    ]
*/