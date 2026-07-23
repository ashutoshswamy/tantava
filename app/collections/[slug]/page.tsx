import { Suspense } from "react";
import CollectionSlugPage from "./client";

export default function Page() {
  return (
    <Suspense fallback={null}>
      <CollectionSlugPage />
    </Suspense>
  );
}
