import { load_students, PROGRAMS, type ProgramKey } from "./students";
import { load_office_records } from "./office_records";
import { program_folder, type ProgramFolder } from "./roster";

/** Every office page needs the same two reads, so they happen in one place. */
export async function load_program_folder(
  key: string
): Promise<ProgramFolder | null> {
  if (!(key in PROGRAMS)) return null;

  const [students, records] = await Promise.all([
    load_students(),
    load_office_records(),
  ]);

  return program_folder(key as ProgramKey, students, records);
}
