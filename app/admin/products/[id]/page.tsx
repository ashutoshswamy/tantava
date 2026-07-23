import { Suspense } from "react";
import EditProductPage from "./client";

export default function Page() {
  return (
    <Suspense fallback={null}>
      <EditProductPage />
    </Suspense>
  );
}
