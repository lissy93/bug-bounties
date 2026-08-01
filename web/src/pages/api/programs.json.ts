import type { APIRoute } from "astro";
import { json } from "@lib/api";
import { loadAllPrograms } from "@lib/load-all-programs";

export const GET: APIRoute = async () => {
  const { listPrograms, trancoRanks, kevCounts } = await loadAllPrograms();

  const programs = listPrograms.map(
    ({ completeness: _completeness, handle: _handle, ...p }) => ({
      ...p,
      tranco_rank: trancoRanks[p.slug] ?? null,
      kev_count: kevCounts[p.slug] ?? 0,
    }),
  );

  return json({
    meta: { total: programs.length, generated: new Date().toISOString() },
    programs,
  });
};
