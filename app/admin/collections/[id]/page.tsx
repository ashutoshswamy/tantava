import { Suspense } from "react";
import EditCollectionPage from "./client";

export default function Page() {
  return (
    <Suspense fallback={null}>
      <EditCollectionPage />
    </Suspense>
  );
}
