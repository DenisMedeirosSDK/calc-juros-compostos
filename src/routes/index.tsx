import { BrowserRouter, Route, Routes } from "react-router-dom";
import { App } from "../App";
import { DefaultLayout } from "../layout/default-layout";

export function RoutesPages() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<DefaultLayout />}>
          <Route path="/" element={<App />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
