import { redirect } from "next/navigation";

/**
 * /office is only an address, not a page.
 *
 * The office side of the portal is the one that has always been there — the roster,
 * the paperwork colours, the filters — with the class folders as one section inside it.
 * An earlier attempt made this a page of its own, which threw all of that away and read
 * as a different app. It redirects instead, so there is one short link to remember and
 * it lands on the real thing.
 */
export default function OfficeEntry() {
  redirect("/?view=office");
}
