import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DocPage } from "@/components/DocPage";
import { getAllDocs, getDocBySlug } from "@/lib/docs";

type PageProps = {
  params: { slug?: string[] };
};

export function generateStaticParams() {
  return getAllDocs()
    .filter((slug) => slug.length)
    .map((slug) => ({ slug: slug.split("/") }));
}

export function generateMetadata({ params }: PageProps): Metadata {
  const doc = getDocBySlug(params.slug ?? []);
  if (!doc) {
    return {};
  }

  return {
    title: doc.title,
    description: doc.description,
  };
}

export default function DocRoute({ params }: PageProps) {
  const doc = getDocBySlug(params.slug ?? []);
  if (!doc) {
    notFound();
  }

  return <DocPage doc={doc} />;
}
