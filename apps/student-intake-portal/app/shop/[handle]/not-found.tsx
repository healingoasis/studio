import Link from "next/link";

export default function NotFound() {
  return (
    <main className="wrap">
      <div className="crumb">
        <Link href="/">← Back to the portal</Link>
      </div>
      <div className="setup">
        <h2>That one is not in the shop</h2>
        <p>
          It may have sold out, been unpublished, or been renamed. Everything currently
          for sale is listed back on the portal page.
        </p>
      </div>
    </main>
  );
}
