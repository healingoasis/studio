import Link from "next/link";

export default function NotFound() {
  return (
    <main className="wrap">
      <div className="crumb">
        <Link href="/">← Back to the portal</Link>
      </div>
      <div className="setup">
        <h2>That program is not open right now</h2>
        <p>
          There is no class currently taking enrolments for it on the store. Whatever is
          open is listed back on the portal page.
        </p>
      </div>
    </main>
  );
}
