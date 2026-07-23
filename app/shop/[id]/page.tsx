import { Suspense } from "react";
import ProductDetailPage from "./client";

export default function Page() {
  return (
    <Suspense fallback={null}>
      <ProductDetailPage />
    </Suspense>
  );
}
