/**
 * A stand-in cover for the things the store has no photograph of — the programs, the
 * seminars, the conference. Set as type on a tinted panel rather than a stock image, so
 * it reads as a deliberate cover instead of pretending to be a photo of something.
 * The moment a real photograph is uploaded to Shopify it takes over automatically.
 *
 * Shared so a shelf card and the page it opens use the same colour, and clicking one
 * lands somewhere that looks like where you came from.
 */

const tone_class = (tone: number) => `tone-${((tone % 5) + 5) % 5}`;

/** Small version, sitting in the photo slot of a shelf card. */
export function Cover({
  title,
  tone,
  kicker,
}: {
  title: string;
  tone: number;
  kicker?: string;
}) {
  return (
    <span className={`cover ${tone_class(tone)}`}>
      {kicker ? <span className="cover-kicker">{kicker}</span> : null}
      <span className="cover-title">{title}</span>
    </span>
  );
}

/**
 * Page-width version. This carries the page's real heading rather than repeating a
 * title that also appears underneath it.
 */
export function CoverHero({
  title,
  tone,
  kicker,
  subtitle,
}: {
  title: string;
  tone: number;
  kicker?: string;
  subtitle?: string;
}) {
  return (
    <div className={`cover cover-hero ${tone_class(tone)}`}>
      {kicker ? <p className="cover-kicker">{kicker}</p> : null}
      <h1 className="cover-title">{title}</h1>
      {subtitle ? <p className="cover-subtitle">{subtitle}</p> : null}
    </div>
  );
}

/** Steady per product, so a given seminar keeps the same colour between loads. */
export function tone_of(seed: string): number {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  return h;
}
