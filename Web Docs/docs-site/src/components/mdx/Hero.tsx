import Link from "next/link";

type HeroProps = {
  title: string;
  subtitle: string;
  description: string;
  primaryLabel: string;
  primaryHref: string;
  secondaryLabel?: string;
  secondaryHref?: string;
};

export function Hero({
  title,
  subtitle,
  description,
  primaryLabel,
  primaryHref,
  secondaryLabel,
  secondaryHref,
}: HeroProps) {
  return (
    <section className="hero fade-in">
      <div className="doc-kicker">{subtitle}</div>
      <h1>{title}</h1>
      <p>{description}</p>
      <div className="hero-actions">
        <Link className="button-primary" href={primaryHref}>
          {primaryLabel}
        </Link>
        {secondaryLabel && secondaryHref ? (
          <Link className="button-secondary" href={secondaryHref}>
            {secondaryLabel}
          </Link>
        ) : null}
      </div>
    </section>
  );
}
