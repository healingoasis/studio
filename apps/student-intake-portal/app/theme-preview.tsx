"use client";

import { useEffect, useState } from "react";

/**
 * A preview control for Daniel, not part of the product.
 *
 * His Mac is set to dark, so he never sees what the pages look like for the many people
 * whose devices are not. This forces the page into either theme so both can be checked
 * while the work is going on. Delete this file and its two lines in layout.tsx to remove
 * it — nothing else depends on it.
 */

type Choice = "system" | "light" | "dark";

const KEY = "ho-theme-preview";

const OPTIONS: { value: Choice; label: string }[] = [
  { value: "system", label: "System" },
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" },
];

function apply(choice: Choice) {
  const root = document.documentElement;
  if (choice === "system") root.removeAttribute("data-theme");
  else root.setAttribute("data-theme", choice);
}

export default function ThemePreview() {
  const [choice, set_choice] = useState<Choice>("system");

  // Read what was chosen last time, once mounted.
  useEffect(() => {
    const saved = window.localStorage.getItem(KEY) as Choice | null;
    if (saved === "light" || saved === "dark" || saved === "system") {
      set_choice(saved);
      apply(saved);
    }
  }, []);

  function choose(next: Choice) {
    set_choice(next);
    apply(next);
    window.localStorage.setItem(KEY, next);
  }

  return (
    <div className="theme-preview" role="group" aria-label="Preview theme (not part of the product)">
      <span className="theme-preview-label">Preview</span>
      {OPTIONS.map((o) => (
        <button
          key={o.value}
          type="button"
          aria-pressed={choice === o.value}
          onClick={() => choose(o.value)}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
