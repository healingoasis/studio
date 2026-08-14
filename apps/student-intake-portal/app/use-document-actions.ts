"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { STATUS_ORDER, type DocStatus } from "@/lib/documents";

/**
 * Everything a view can *do* to a document, in one place.
 *
 * The portal and the student file are two presentations of the same product, and they
 * have to stay in step — so the behaviour lives here and only the look lives in each
 * view. A change to how uploading works reaches both without being written twice.
 */
export function useDocumentActions() {
  const router = useRouter();
  const [busy, set_busy] = useState<string | null>(null);
  const [problem, set_problem] = useState<string | null>(null);
  const [, start_transition] = useTransition();

  async function send(
    key: string,
    run: () => Promise<Response>,
    fallback: string
  ): Promise<void> {
    set_busy(key);
    set_problem(null);
    try {
      const response = await run();
      if (!response.ok) {
        const body = (await response.json().catch(() => ({}))) as { error?: string };
        set_problem(body.error ?? fallback);
        return;
      }
      start_transition(() => router.refresh());
    } catch {
      set_problem(fallback);
    } finally {
      set_busy(null);
    }
  }

  function upload(student_id: string, doc_id: string, file: File) {
    const form = new FormData();
    form.append("student_id", student_id);
    form.append("doc_id", doc_id);
    form.append("file", file);

    void send(
      doc_id,
      () => fetch("/api/documents", { method: "POST", body: form }),
      "That upload did not go through. Please try again."
    );
  }

  function set_status(student_id: string, doc_id: string, status: DocStatus) {
    void send(
      doc_id,
      () =>
        fetch("/api/documents", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ student_id, doc_id, status }),
        }),
      "That change did not save. Please try again."
    );
  }

  function remove(student_id: string, doc_id: string) {
    void send(
      doc_id,
      () =>
        fetch("/api/documents", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ student_id, doc_id }),
        }),
      "That could not be removed. Please try again."
    );
  }

  function cycle(student_id: string, doc_id: string, from: DocStatus) {
    const next = STATUS_ORDER[(STATUS_ORDER.indexOf(from) + 1) % STATUS_ORDER.length];
    set_status(student_id, doc_id, next ?? "not_started");
  }

  return { busy, problem, upload, set_status, remove, cycle };
}

/** Where an uploaded document can be opened. */
export function document_href(student_id: string, doc_id: string): string {
  return `/api/documents/file?student_id=${encodeURIComponent(
    student_id
  )}&doc_id=${encodeURIComponent(doc_id)}`;
}

export const UPLOAD_ACCEPT = ".pdf,.jpg,.jpeg,.png,.heic,.heif,.webp,.doc,.docx";
