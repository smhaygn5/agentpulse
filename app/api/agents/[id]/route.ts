import { NextResponse, type NextRequest } from "next/server";
import { getAgent } from "@/lib/mock/agents";
import { buildAgentReport } from "@/lib/sources";
import { generateSummary } from "@/lib/ai/summary";
import { agentId } from "@/lib/security/validation";
import { rateLimit, clientIp } from "@/lib/security/rate-limit";

/**
 * GET /api/agents/:id — runs the full reputation pipeline for one agent:
 * fetch raw signals -> deterministic scoring -> AI/template summary.
 *
 * Security: input is zod-validated, requests are rate-limited per IP, and all
 * data fetching + secrets stay server-side (this route is a Node handler).
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const limit = rateLimit(`agent:${clientIp(request.headers)}`);
  if (!limit.ok) {
    return NextResponse.json(
      { error: "Rate limit exceeded" },
      { status: 429, headers: { "Retry-After": "60" } },
    );
  }

  const parsed = agentId.safeParse((await params).id);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid agent id" }, { status: 400 });
  }

  const agent = getAgent(parsed.data);
  if (!agent) {
    return NextResponse.json({ error: "Agent not found" }, { status: 404 });
  }

  const report = await buildAgentReport({
    id: agent.id,
    name: agent.name,
    symbol: agent.symbol,
    address: agent.address,
    repo: agent.developer.repo,
  });
  const summary = await generateSummary(agent.name, report);

  return NextResponse.json(
    {
      id: agent.id,
      name: agent.name,
      version: report.version,
      trustScore: report.trustScore,
      scores: report.scores,
      summary,
      generatedAt: report.generatedAt,
    },
    { headers: { "Cache-Control": "public, max-age=60, s-maxage=300" } },
  );
}
