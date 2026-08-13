"use client";

import { useMemo, useState } from "react";
import { checkout_url, type ProductDetail } from "@/lib/shop";

const money = (n: number) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD" });

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

  return (
    <div className="product">
      <div className="product-media">
        {main_image ? (
          <>
            <div className="product-photo">
              {/* Plain img on purpose: next/image wants sharp, which this workspace skips. */}
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
          </>
        ) : (
          <div className="product-photo empty">
            <span>No photograph on the store yet</span>
          </div>
        )}
      </div>

      <div className="product-detail">
        <h1>{product.title}</h1>

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

        {product.options.map((option, index) => (
          <fieldset className="chooser" key={option.name}>
            <legend>{option.name}</legend>
            <div className="choices">
              {option.values.map((value) => {
                const in_stock = value_available(index, value);
                return (
                  <button
                    key={value}
                    type="button"
                    className="choice"
                    aria-pressed={chosen[index] === value}
                    onClick={() => choose(index, value)}
                  >
                    {value}
                    {!in_stock ? <span className="muted"> · sold out</span> : null}
                  </button>
                );
              })}
            </div>
          </fieldset>
        ))}

        <div className="buy">
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
