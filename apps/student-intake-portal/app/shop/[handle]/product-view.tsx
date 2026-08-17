"use client";

import { useMemo, useState } from "react";
import {
  breakdown,
  CARD_FEE_RATE,
  checkout_url,
  is_real_option,
  type ProductDetail,
} from "@/lib/shop";
import { CoverHero, tone_of } from "../../cover";
import HeroCarousel from "../../hero-carousel";

const money = (n: number) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD" });

const fee_percent = `${(CARD_FEE_RATE * 100).toFixed(1)}%`;

/**
 * The listed price already has the card fee in it, so a $200 deposit reads as $206.80.
 * One line under the price says so — enough to be straight about it without turning
 * every page into an invoice. Which way to pay is chosen at checkout.
 */
export function FeeLine({
  total,
  fee_included,
}: {
  total: number;
  fee_included: boolean;
}) {
  const split = breakdown(total, fee_included);
  if (!split) return null;

  return (
    <p className="fee-line">
      Includes {fee_percent} card processing ({money(split.fee)}) ·{" "}
      {money(split.base)} by check
    </p>
  );
}

export default function ProductView({ product }: { product: ProductDetail }) {
  const [photo, set_photo] = useState(0);

  // Start on the first variant someone can actually buy.
  const [chosen, set_chosen] = useState<string[]>(() => {
    const first = product.variants.find((v) => v.available) ?? product.variants[0];
    return first?.options ?? [];
  });

  const variant = useMemo(() => {
    if (product.options.length === 0) return product.variants[0];
    return product.variants.find((v) =>
      v.options.every((value, index) => value === chosen[index])
    );
  }, [product, chosen]);

  /** Only options with something to pick; a lone "Regular" is not a choice. */
  const shown_options = product.options
    .map((option, index) => ({ option, index }))
    .filter(({ option }) => is_real_option(option));

  const prices_vary = product.price_min !== product.price_max;

  /** What picking this value would cost, given everything else already chosen. */
  function price_if(index: number, value: string): number | null {
    if (!prices_vary) return null;
    const candidate = [...chosen];
    candidate[index] = value;
    const match = product.variants.find((v) =>
      v.options.every((option_value, i) => option_value === candidate[i])
    );
    return match ? match.price : null;
  }

  function choose(index: number, value: string) {
    set_chosen((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
  }

  /** Whether a given choice can still lead to something in stock. */
  function value_available(index: number, value: string): boolean {
    return product.variants.some(
      (v) => v.available && v.options[index] === value
    );
  }

  const main_image = product.images[photo] ?? product.images[0] ?? null;
  const varies = product.price_min !== product.price_max;

  const is_conference = /conference/i.test(product.title);
  const kicker = is_conference ? "Conference" : "Continuing education";

  // Seminars and the conference lead with one photograph; merchandise gets a gallery.
  const is_event = product.options.some((o) =>
    /registration type/i.test(o.name)
  );

  return (
    // Programmes and seminars have no photographs on the store, so they read as one
    // column rather than leaving half the page empty.
    <div className={`product ${main_image && !is_event ? "" : "no-photo"}`}>
      {/* A seminar or the conference: one class photograph, full width, with the title
          laid over it. Merchandise keeps its gallery, since choosing a bale colour needs
          thumbnails rather than a banner. */}
      {is_event && main_image ? (
        <div className="photo-hero">
          <HeroCarousel images={product.images} alt={product.title} />
          <div className="photo-hero-text">
            <p className="cover-kicker">{kicker}</p>
            <h1 className="cover-title">{product.title}</h1>
          </div>
        </div>
      ) : null}

      {!main_image ? (
        <CoverHero
          title={product.title}
          tone={tone_of(product.handle)}
          kicker={kicker}
        />
      ) : null}

      {main_image && !is_event ? (
        <div className="product-media">
          <div className="product-photo">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={main_image} alt={product.title} />
          </div>
          {product.images.length > 1 ? (
            <div className="thumbs">
              {product.images.map((src, index) => (
                <button
                  key={src}
                  type="button"
                  className={`thumb ${index === photo ? "on" : ""}`}
                  aria-label={`Photo ${index + 1} of ${product.images.length}`}
                  aria-pressed={index === photo}
                  onClick={() => set_photo(index)}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={src} alt="" />
                </button>
              ))}
            </div>
          ) : null}
        </div>
      ) : null}

      <div className="product-detail">
        {main_image && !is_event ? <h1>{product.title}</h1> : null}

        {product.description_html ? (
          <div
            className="product-copy"
            dangerouslySetInnerHTML={{ __html: product.description_html }}
          />
        ) : (
          <p className="product-copy muted">
            There is no description on the store for this one yet.
          </p>
        )}

        <div className="buy">
          {shown_options.map(({ option, index }) => (
            <fieldset className="chooser" key={option.name}>
              <legend>{option.name}</legend>
              <div className="choices">
                {option.values.map((value) => {
                  const in_stock = value_available(index, value);
                  const price = price_if(index, value);
                  return (
                    <button
                      key={value}
                      type="button"
                      className="choice"
                      aria-pressed={chosen[index] === value}
                      onClick={() => choose(index, value)}
                    >
                      <span className="choice-name">{value}</span>
                      {price !== null ? (
                        <span className="choice-price">{money(price)}</span>
                      ) : null}
                      {!in_stock ? <span className="muted">sold out</span> : null}
                    </button>
                  );
                })}
              </div>
            </fieldset>
          ))}

          <p className="product-price">
            {variant ? (
              money(variant.price)
            ) : varies ? (
              <>
                {money(product.price_min)}
                <span className="to">–</span>
                {money(product.price_max)}
              </>
            ) : (
              money(product.price_min)
            )}
            {variant?.compare_at ? (
              <span className="was">{money(variant.compare_at)}</span>
            ) : null}
          </p>

          {variant ? (
            <FeeLine total={variant.price} fee_included={product.fee_included} />
          ) : null}

          {variant?.available ? (
            <>
              <a className="btn big" href={checkout_url(variant.id)}>
                Buy now — {money(variant.price)}
              </a>
              <p className="buy-note">
                This takes you to the Healing Oasis store to pay. Nothing is charged until
                you finish checking out there.
              </p>
            </>
          ) : (
            <>
              <span className="btn big disabled" aria-disabled="true">
                {variant ? "Sold out" : "Choose an option"}
              </span>
              <p className="buy-note">
                {variant
                  ? "This one is out of stock. Try another option above."
                  : "Pick from the choices above to see the price and buy."}
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
