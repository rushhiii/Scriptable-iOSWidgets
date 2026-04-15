import { notFound } from "next/navigation";
import { DocPage } from "@/components/DocPage";
import { getDocBySlug } from "@/lib/docs";

export default function HomePage() {
  const doc = getDocBySlug([]);
  if (!doc) {
    notFound();
  }

  return <DocPage doc={doc} />;
}
