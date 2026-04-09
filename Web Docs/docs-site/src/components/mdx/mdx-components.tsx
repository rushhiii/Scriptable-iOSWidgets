import Link from "next/link";
import type { ComponentPropsWithoutRef } from "react";
import { Callout } from "./Callout";
import { Card, CardGrid } from "./Cards";
import { Hero } from "./Hero";

type AnchorProps = ComponentPropsWithoutRef<"a">;

function SmartLink({ href = "", ...props }: AnchorProps) {
  if (href.startsWith("http")) {
    return <a href={href} target="_blank" rel="noreferrer" {...props} />;
  }

  return <Link href={href} {...props} />;
}

export const mdxComponents = {
  a: SmartLink,
  Callout,
  Card,
  CardGrid,
  Hero,
};
