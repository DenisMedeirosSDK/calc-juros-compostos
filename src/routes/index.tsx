import { BrowserRouter, Route, Routes } from "react-router-dom";
import { App } from "../App";
import { DefaultLayout } from "../layout/default-layout";
import { TaxImport } from "../pages/tax-import";

export function RoutesPages() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<DefaultLayout />}>
          <Route path="/" element={<App />} />
          <Route path="/imposto-de-importacao" element={<TaxImport />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
