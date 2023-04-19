import { lazy, StrictMode } from "react";
import ReactDOM from "react-dom/client";

import reportWebVitals from "./reportWebVitals";

import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

const Root = lazy(() => import("./routes/root"));
const ErrorPage = lazy(() => import("./error-page"));
const CourseFlow = lazy(() => import("./routes/courseflow"));

import "./index.css";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/courses/:courseName",
        element: <CourseFlow />,
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