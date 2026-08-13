"use client";

import { useState } from "react";
import { checkout_url } from "@/lib/shop";
import type { Cohort } from "./page";

const money = (n: number) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD" });

export default function ProgramView({
  short_name,
  full_name,
  cohorts,
}: {
  short_name: string;
  full_name: string;
  cohorts: Cohort[];
}) {
  // Open on the first class someone can still join.
  const [picked, set_picked] = useState(() => {
    const open = cohorts.findIndex((c) => c.product.available);
    return open === -1 ? 0 : open;
  });

  const cohort = cohorts[picked] ?? cohorts[0];
  if (!cohort) return null;

  const variant =
    cohort.product.variants.find((v) => v.available) ?? cohort.product.variants[0];

  const deposit_variant = cohort.deposit
    ? (cohort.deposit.variants.find((v) => v.available) ?? cohort.deposit.variants[0])
    : null;

  return (
    <div className="product no-photo">
      <div className="product-detail">
        <p className="eyebrow">{short_name}</p>
        <h1>{full_name}</h1>

        {cohorts.length > 1 ? (
          <fieldset className="chooser">
            <legend>Choose a class</legend>
            <div className="choices">
              {cohorts.map((c, index) => (
                <button
                  key={c.product.handle}
                  type="button"
                  className="choice"
                  aria-pressed={index === picked}
                  onClick={() => set_picked(index)}
                >
                  {c.label}
                  {!c.product.available ? (
                    <span className="muted"> · closed</span>
                  ) : null}
                </button>
              ))}
            </div>
          </fieldset>
        ) : null}

        <p className="product-price">
          {variant ? money(variant.price) : money(cohort.product.price_min)}
        </p>

        {cohort.product.description_html ? (
          <div
            className="product-copy"
            dangerouslySetInnerHTML={{ __html: cohort.product.description_html }}
          />
        ) : (
          <p className="product-copy muted">
            There is no description on the store for this class yet.
          </p>
        )}

        <div className="buy">
          {variant?.available ? (
            <>
              <div className="buy-options">
                <a className="btn big" href={checkout_url(variant.id)}>
                  Pay in full — {money(variant.price)}
                </a>
                {deposit_variant?.available ? (
                  <a className="btn big ghost" href={checkout_url(deposit_variant.id)}>
                    Pay the deposit — {money(deposit_variant.price)}
                  </a>
                ) : null}
              </div>
              <p className="buy-note">
                {cohorts.length > 1 ? (
                  <>
                    Either way you are enrolling on the{" "}
                    <strong>{cohort.label}</strong> class.{" "}
                  </>
                ) : null}
                {deposit_variant?.available ? (
                  <>
                    The deposit holds your place; the remaining{" "}
                    {money(Math.max(0, variant.price - deposit_variant.price))} is due
                    before the first module and can be paid from your portal page.{" "}
                  </>
                ) : null}
                You will be taken to the Healing Oasis store to pay, and nothing is
                charged until you finish checking out there.
              </p>
            </>
          ) : (
            <>
              <span className="btn big disabled" aria-disabled="true">
                Not open for enrolment
              </span>
              <p className="buy-note">
                {cohorts.length > 1
                  ? "That class is closed. Try another one above."
                  : "This program is not taking enrolments on the store right now."}
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
