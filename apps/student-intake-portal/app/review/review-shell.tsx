"use client";

import { useState, type ComponentProps } from "react";
import Portal from "../portal";
import RecordView from "../record/record-view";
import { ReviewSwap } from "../version-switch";

/**
 * The shareable review copy.
 *
 * Both versions normally live at their own address, which a hosted single page cannot
 * do — so this holds them both and swaps between them in place. The switch in each
 * version's header drives the swap through `ReviewSwap`; neither version knows it is
 * being reviewed rather than run.
 *
 * Links that would leave for a program or shop page have nowhere to go here, so they
 * are caught and answered with a note rather than left to fail.
 */
export default function ReviewShell({
  portal,
  record,
}: {
  portal: ComponentProps<typeof Portal>;
  record: ComponentProps<typeof RecordView>;
}) {
  const [version, set_version] = useState<"/" | "/record">("/");
  const [note, set_note] = useState(false);

  return (
    <ReviewSwap.Provider value={set_version}>
      <div
        onClickCapture={(e) => {
          const link = (e.target as HTMLElement).closest?.("a[href^='/']");
          if (!link) return;
          e.preventDefault();
          e.stopPropagation();
          set_note(true);
          window.setTimeout(() => set_note(false), 3200);
        }}
      >
        {version === "/" ? <Portal {...portal} /> : <RecordView {...record} />}
      </div>

      <p className={note ? "review-note on" : "review-note"} role="status">
        The program and shop pages are not in this review copy — the two versions in the
        switch are.
      </p>
    </ReviewSwap.Provider>
  );
}
