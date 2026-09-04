"use client";

import { useState, type ComponentProps } from "react";
import StudentFile from "../student-file";

/**
 * The shareable review copy.
 *
 * Links that would leave for a program or shop page have nowhere to go in a single
 * published file, so they are caught and answered with a note rather than left to fail.
 */
export default function ReviewShell({
  record,
}: {
  record: ComponentProps<typeof StudentFile>;
}) {
  const [note, set_note] = useState(false);

  return (
    <>
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
        <StudentFile {...record} />
      </div>

      <p className={note ? "review-note on" : "review-note"} role="status">
        The program and shop pages are not in this review copy.
      </p>
    </>
  );
}
