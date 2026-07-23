import { Suspense } from "react";
import EditCategoryPage from "./client";

export default function Page() {
  return (
    <Suspense fallback={null}>
      <EditCategoryPage />
    </Suspense>
  );
}
