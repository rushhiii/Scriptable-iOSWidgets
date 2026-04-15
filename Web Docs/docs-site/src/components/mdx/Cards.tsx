import Link from "next/link";
import type { ReactNode } from "react";

type CardProps = {
  title: string;
  href: string;
  meta?: string;
  children?: ReactNode;
};

export function CardGrid({ children }: { children: ReactNode }) {
  return <div className="card-grid">{children}</div>;
}

export function Card({ title, href, meta, children }: CardProps) {
  return (
    <Link className="card" href={href}>
      <div className="card-title">{title}</div>
      {meta ? <div className="card-meta">{meta}</div> : null}
      {children ? <div>{children}</div> : null}
    </Link>
  );
}
