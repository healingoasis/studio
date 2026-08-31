"use client";

export default function PrintButton({ count }: { count: number }) {
  return (
    <button
      type="button"
      className="print-button"
      disabled={count === 0}
      onClick={() => window.print()}
    >
      Print {count > 0 ? `all ${count}` : ""}
    </button>
  );
}
