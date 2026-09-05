import { createBrowserRouter, RouterProvider } from "react-router";
import DashboardGrid from "../home";
import NotFound from "../notFound";
import SimpleForm from "../modules/iris-flower";
import NepalHousePredictor from "../modules/house-price-prediction";
import LoanStatusPredictor from "../modules/loan_status_predictor";

const routerConfig = createBrowserRouter([
  { path: "/", Component: DashboardGrid },
  { path: "irisflower", Component: SimpleForm },
  { path: "house-price-prediction", Component: NepalHousePredictor },
  { path: "loan-status-predictor", Component: LoanStatusPredictor },
  {
    path: "*",
    Component: NotFound,
  },
]);

const RouterConfig = () => {
  return (
    <>
      <RouterProvider router={routerConfig} />
    </>
  );
};
export default RouterConfig;
