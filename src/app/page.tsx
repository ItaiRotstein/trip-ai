import DestinationSearch from "@/components/DestinationSearch";
import { Suspense } from "react";

export default function Home() {
  return (
    <main className="p-4">
      <Suspense fallback={<div>Loading...</div>}>
        <DestinationSearch />
      </Suspense>
    </main>
  );
}
