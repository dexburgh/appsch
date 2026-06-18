import { NextResponse } from 'next/server';

import {
  getPersonalityMatrix,
  getPersonalitySummary,
  resolvePersonalityProject,
} from '@/lib/personalityMatrix';

export async function GET(request) {
  const url = request ? new URL(request.url) : null;
  const requestedProject = url?.searchParams.get('project');
  const project = resolvePersonalityProject(requestedProject);
  const summary = getPersonalitySummary();
  const frameworks = getPersonalityMatrix();

  return NextResponse.json({
    ok: true,
    project,
    summary,
    frameworks,
  });
}
