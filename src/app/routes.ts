import { createBrowserRouter } from "react-router";
import { LandingPage } from "./components/LandingPage";
import { BingoGame } from "./components/BingoGame";
import { CustomerSupport } from "./components/CustomerSupport";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: BingoGame,
  },
  {
    path: "/customer-support",
    Component: CustomerSupport,
  },
]);
