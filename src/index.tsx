import { lazy, StrictMode } from "react";
import ReactDOM from "react-dom/client";

import reportWebVitals from "./reportWebVitals";

import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

import Root from "./routes/root";
import ErrorPage from "./error-page";
const LayoutFlow = lazy(() => import("./routes/course"));

import "./index.css";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/courses/",
        element: <div>Search for a course to see what it is a pre- or co-requisite of!</div>,
      },
      {
        path: "/courses/:courseName",
        element: <LayoutFlow />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);

reportWebVitals(console.log);