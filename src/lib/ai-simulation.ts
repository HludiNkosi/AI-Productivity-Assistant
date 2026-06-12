import type { AgentType } from '../types';

const responses: Record<AgentType, Record<string, string[]>> = {
  research: {
    search: [
      'Based on my research, I found several relevant sources. The key findings indicate a growing trend in AI adoption across enterprises, with 78% of companies reporting increased efficiency.',
      'I have analyzed multiple data sources and compiled the following findings: The market is projected to grow at a CAGR of 42.8% through 2028, driven by advances in natural language processing.',
      'Research complete. I identified 5 high-quality sources. The consensus among experts is that AI-driven automation will reshape workflow management within the next 3 years.',
    ],
    validate: [
      'Source validation complete. 4 out of 5 sources are peer-reviewed and published within the last 2 years. Confidence level: High.',
      'I have cross-referenced the findings with multiple databases. The data is consistent across sources with minor variations in methodology.',
    ],
    report: [
      'Research report generated. Executive summary: The findings support the hypothesis that AI integration significantly improves productivity metrics by an average of 35%.',
    ],
  },
  writing: {
    email: [
      'I have drafted a professional email that maintains a courteous tone while clearly conveying the key points. The email follows standard business communication structure.',
      'Email draft completed. I have structured it with a clear opening, supporting context in the body, and a specific call-to-action in the closing.',
    ],
    proposal: [
      'Proposal draft completed. The document includes: Executive Summary, Problem Statement, Proposed Solution, Timeline, and Budget Overview. Ready for review and customization.',
      'I have prepared a comprehensive proposal that addresses all key requirements. The structure follows industry best practices for professional proposals.',
    ],
    report: [
      'Report drafted with the following sections: Introduction, Methodology, Findings, Analysis, and Recommendations. The tone is objective and data-driven.',
    ],
  },
  code: {
    generate: [
      'Code generated successfully. The implementation follows best practices with proper error handling, type safety, and documentation. Ready for integration.',
      'I have written clean, modular code that follows SOLID principles. The solution is optimized for both readability and performance.',
    ],
    debug: [
      'Bug identified: The issue is caused by an unhandled edge case in the data validation logic. I have provided a fix that adds proper null checks and error boundaries.',
      'Debugging complete. Found 2 issues: 1) Race condition in the async handler, 2) Missing error propagation. Both have been addressed in the fix.',
    ],
    explain: [
      'Code explanation: This module implements a publish-subscribe pattern for event-driven communication. The key components are: EventBroker (manages subscriptions), Publisher (emits events), and Subscriber (consumes events). The pattern enables loose coupling between components.',
      'This code implements a memoized selector pattern. It caches the result of expensive computations and only recalculates when input dependencies change. This is commonly used in state management for performance optimization.',
    ],
  },
  executive: {
    briefing: [
      'Good morning. Here is your daily briefing for today. You have 4 meetings scheduled, 7 pending emails requiring attention, and 3 tasks approaching their deadline. Your highest priority item is the quarterly review preparation due tomorrow.',
      'Daily briefing ready. Key highlights: 2 urgent items need your attention, your afternoon schedule is clear for deep work, and the team standup has been moved to 10 AM.',
    ],
    digest: [
      'Email digest prepared. You have 12 unread emails. 3 are marked urgent from the finance team regarding Q4 budget approvals. 5 are project updates requiring no action. 4 are informational newsletters.',
    ],
    priorities: [
      'Suggested priorities for today: 1) Review and approve Q4 budget (Urgent), 2) Prepare quarterly presentation (High), 3) Follow up with engineering on sprint deliverables (Medium), 4) Review team feedback surveys (Low).',
    ],
  },
  calendar: {
    schedule: [
      'Meeting scheduled successfully. I have found an optimal time slot that works for all attendees. Calendar invites have been prepared.',
      'I have identified 3 available time slots this week that avoid conflicts with your existing commitments. The recommended slot is Wednesday 2:00-3:00 PM.',
    ],
    conflict: [
      'Conflict detected: The proposed meeting overlaps with your "Team Standup" from 9:00-9:30 AM. Would you like me to suggest alternative times or reschedule the standup?',
      'Date conflict found: You have 2 overlapping meetings on Thursday at 11:00 AM. I recommend moving the design review to 3:00 PM or the client call to 11:30 AM.',
    ],
    agenda: [
      'Agenda generated for the meeting. Structure: 1) Opening & context (5 min), 2) Progress review (15 min), 3) Key decisions needed (10 min), 4) Action items & next steps (5 min), 5) Q&A (5 min).',
    ],
    brief: [
      'Meeting preparation brief prepared. Attendee backgrounds, recent project context, and key talking points have been compiled. You are well-prepared for this discussion.',
    ],
    followup: [
      'Follow-up email drafted. It summarizes the key decisions made, action items assigned, and deadlines agreed upon. Ready for your review and send.',
    ],
  },
  voice: {
    command: [
      'Voice command recognized and processed. I am executing the requested action now.',
      'Understood. I have processed your voice command and am taking the appropriate action.',
    ],
    response: [
      'I have processed your request. The action has been completed successfully. Is there anything else you would like me to assist with?',
      'Task completed as requested. The results have been saved and are available for your review.',
    ],
  },
};

function getRandomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function generateAIResponse(agentType: AgentType, action: string, input?: string): string {
  const agentResponses = responses[agentType];
  const actionResponses = agentResponses[action] || agentResponses[Object.keys(agentResponses)[0]];
  const baseResponse = getRandomItem(actionResponses);

  if (input && input.length > 0) {
    return `${baseResponse}\n\nRegarding your input: "${input.substring(0, 100)}${input.length > 100 ? '...' : ''}" — I have analyzed the context and tailored my response accordingly.`;
  }

  return baseResponse;
}

export function generateEmailDraft(context: string, recipient: string, tone: string): { subject: string; body: string } {
  const subjects = [
    `Follow-up: ${context}`,
    `Regarding ${context}`,
    `Action Required: ${context}`,
    `Update on ${context}`,
  ];

  const toneOpenings: Record<string, string> = {
    formal: 'Dear',
    professional: 'Hello',
    casual: 'Hi',
    friendly: 'Hey',
  };

  const subject = getRandomItem(subjects);
  const opening = toneOpenings[tone] || 'Hello';

  const body = `${opening} ${recipient},\n\nI am writing to address the matter of ${context}. After careful consideration, I would like to bring the following points to your attention:\n\n1. The current status requires prompt attention to ensure timely delivery.\n2. Key stakeholders have been consulted and their feedback has been incorporated.\n3. The proposed timeline aligns with our strategic objectives.\n\nI would appreciate the opportunity to discuss this further at your earliest convenience. Please let me know a suitable time for a follow-up conversation.\n\nThank you for your time and consideration.\n\nBest regards,\nAI Executive Assistant`;

  return { subject, body };
}

export function generateMeetingSummary(title: string, attendees: string[], duration: string): string {
  return `Meeting Summary: ${title}\n\nDuration: ${duration}\nAttendees: ${attendees.join(', ')}\n\nKey Discussion Points:\n1. Project status review — all milestones on track\n2. Resource allocation — additional support approved for Q4\n3. Risk assessment — two items flagged for monitoring\n\nDecisions Made:\n- Approved the revised timeline for the product launch\n- Assigned ownership of the integration module to the engineering team\n- Scheduled follow-up review for next week\n\nAction Items:\n- [Owner] Complete the technical specification by Friday\n- [Owner] Schedule stakeholder alignment meeting\n- [Owner] Update the project dashboard with new timelines`;
}

export function generateAgenda(_title: string, duration: number): string {
  const totalMinutes = duration;
  const sections = [
    { name: 'Opening & Welcome', pct: 0.1 },
    { name: 'Review of Previous Action Items', pct: 0.15 },
    { name: 'Core Discussion Topics', pct: 0.4 },
    { name: 'Decisions & Next Steps', pct: 0.2 },
    { name: 'Q&A and Closing', pct: 0.15 },
  ];

  const agendaItems = sections.map((s) => ({
    topic: s.name,
    duration: Math.round(totalMinutes * s.pct),
  }));

  return agendaItems.map((item) => `${item.duration} min — ${item.topic}`).join('\n');
}

export function suggestBestMeetingTimes(existingMeetings: { start_time: string; end_time: string }[]): string[] {
  const workingHours = { start: 9, end: 17 };
  const suggestions: string[] = [];

  const bookedSlots = existingMeetings.map((m) => ({
    start: new Date(m.start_time).getHours(),
    end: new Date(m.end_time).getHours(),
  }));

  for (let hour = workingHours.start; hour <= workingHours.end - 1; hour++) {
    const isConflicting = bookedSlots.some(
      (slot) => hour >= slot.start && hour < slot.end
    );
    if (!isConflicting) {
      suggestions.push(`${hour}:00 - ${hour + 1}:00`);
    }
  }

  return suggestions.length > 0 ? suggestions.slice(0, 5) : ['No available slots found'];
}

export function generateDailyBriefing(
  tasks: { title: string; priority: string; due_date: string | null }[],
  meetings: { title: string; start_time: string }[],
  emailCount: number
): { important_emails: string; upcoming_deadlines: string; meeting_summaries: string; suggested_priorities: string } {
  const urgentTasks = tasks.filter((t) => t.priority === 'urgent' || t.priority === 'high');
  const todayMeetings = meetings.slice(0, 3);

  return {
    important_emails: `You have ${emailCount} unread emails. ${Math.min(3, emailCount)} require immediate attention.`,
    upcoming_deadlines: urgentTasks.length > 0
      ? urgentTasks.map((t) => `- ${t.title}${t.due_date ? ` (Due: ${new Date(t.due_date).toLocaleDateString()})` : ''}`).join('\n')
      : 'No urgent deadlines.',
    meeting_summaries: todayMeetings.length > 0
      ? todayMeetings.map((m) => `- ${m.title} at ${new Date(m.start_time).toLocaleTimeString()}`).join('\n')
      : 'No meetings scheduled for today.',
    suggested_priorities: urgentTasks.length > 0
      ? `1. ${urgentTasks[0]?.title || 'No priorities'}\n2. Review pending emails\n3. Prepare for upcoming meetings`
      : '1. Review and respond to emails\n2. Plan the week ahead\n3. Clear backlog items',
  };
}

export function generateCodeResponse(prompt: string, action: 'generate' | 'debug' | 'explain'): string {
  const codeExamples: Record<string, string> = {
    generate: `\`\`\`typescript
// Generated implementation
async function processRequest(data: RequestData): Promise<Response> {
  try {
    const validated = validateInput(data);
    const result = await transform(validated);
    return { success: true, data: result };
  } catch (error) {
    logger.error('Processing failed', { error, input: data });
    return { success: false, error: formatError(error) };
  }
}
\`\`\`

The implementation includes input validation, error handling, and logging. It follows async/await patterns for clean asynchronous code.`,

    debug: `Bug analysis complete:

**Issue Found:** Unhandled promise rejection in the event handler
**Root Cause:** Missing try-catch block around async operations
**Fix Applied:**
\`\`\`typescript
// Before (buggy)
button.onclick = async () => {
  const result = await fetchData(); // Can throw, unhandled
  updateUI(result);
};

// After (fixed)
button.onclick = async () => {
  try {
    const result = await fetchData();
    updateUI(result);
  } catch (error) {
    showToast('Failed to load data. Please retry.');
    logger.error('Fetch failed', error);
  }
};
\`\`\`

This ensures errors are caught and the user is informed instead of the app crashing silently.`,

    explain: `Code Explanation:

\`\`\`typescript
const memoizedSelector = createSelector(
  [selectItems, selectFilter],
  (items, filter) => items.filter(item => matchesFilter(item, filter))
);
\`\`\`

This is a **memoized selector** pattern:

1. **Input selectors** (\`selectItems\`, \`selectFilter\`) extract raw data from the store
2. **Result function** combines inputs and computes the derived value
3. **Memoization** caches the result — it only recalculates when inputs change
4. **Reference equality** is preserved, preventing unnecessary re-renders

This pattern is essential for performance in large applications with complex derived state.`,
  };

  const explanation = codeExamples[action];
  return `${explanation}\n\nPrompt analyzed: "${prompt.substring(0, 80)}${prompt.length > 80 ? '...' : ''}"`;
}

export function generateResearchResponse(query: string, action: 'search' | 'validate' | 'report'): string {
  const templates: Record<string, string> = {
    search: `Research Search Results for: "${query}"\n\n**Source 1** — Industry Report 2024\nAI adoption in enterprise settings has increased by 67% year-over-year. Key drivers include automation of repetitive tasks and improved decision-making capabilities.\n\n**Source 2** — Academic Paper (IEEE)\nA comprehensive study across 500 organizations found that AI-assisted workflows reduced average task completion time by 35% while maintaining or improving quality metrics.\n\n**Source 3** — Market Analysis\nThe global AI market is projected to reach $500B by 2028. Natural language processing and computer vision remain the fastest-growing sub-sectors.\n\nI found 5 additional relevant sources. Would you like me to validate these findings or generate a full report?`,

    validate: `Source Validation Report for: "${query}"\n\n**Validation Results:**\n- Source 1: Peer-reviewed journal — Reliability: HIGH\n- Source 2: Industry white paper — Reliability: MEDIUM (industry-funded)\n- Source 3: Government statistics — Reliability: HIGH\n- Source 4: Blog post — Reliability: LOW (not peer-reviewed)\n- Source 5: Conference proceedings — Reliability: MEDIUM-HIGH\n\n**Overall Confidence:** 78%\n**Recommendation:** Cross-reference Sources 1 and 3 for highest reliability. Avoid relying solely on Source 4.`,

    report: `Research Report: "${query}"\n\n**Executive Summary:**\nBased on comprehensive analysis of 5 validated sources, the evidence strongly supports the growing impact of AI on enterprise workflows.\n\n**Key Findings:**\n1. AI adoption rates have increased 67% YoY across Fortune 500 companies\n2. Workflow automation reduces task completion time by an average of 35%\n3. Natural language processing is the most widely adopted AI technology\n4. Cost savings of 20-40% are reported by early adopters\n5. Key challenges include data privacy (72%), skill gaps (65%), and integration complexity (58%)\n\n**Methodology:** Multi-source analysis with cross-validation\n**Confidence Level:** High (78%)\n\n**Recommendations:**\n- Prioritize NLP-based automation for immediate ROI\n- Invest in upskilling programs to address talent gaps\n- Implement robust data governance before scaling AI initiatives`,
  };

  return templates[action];
}

export function generateWritingResponse(prompt: string, action: 'email' | 'proposal' | 'report'): string {
  const templates: Record<string, string> = {
    email: `**Draft Email:**\n\nSubject: Re: ${prompt}\n\nDear Colleague,\n\nThank you for your email regarding ${prompt}. I have reviewed the details and would like to provide the following response:\n\nAfter careful consideration, I believe we should proceed with the proposed approach. The key advantages include:\n\n1. Alignment with our strategic objectives for this quarter\n2. Resource efficiency — the plan leverages existing infrastructure\n3. Timeline feasibility — we can deliver within the proposed schedule\n\nI would like to schedule a brief call to discuss the implementation details. Would Thursday afternoon work for you?\n\nPlease let me know if you have any questions or concerns.\n\nBest regards,\nAI Executive Assistant`,

    proposal: `**Proposal Draft:**\n\n# ${prompt}\n\n## Executive Summary\nThis proposal outlines a comprehensive approach to ${prompt}, designed to deliver measurable results within defined timelines and budgets.\n\n## Problem Statement\nCurrent processes lack the efficiency and scalability required to meet growing demands. Without intervention, we risk falling behind industry standards.\n\n## Proposed Solution\nWe recommend a phased implementation:\n- **Phase 1** (Weeks 1-4): Assessment and planning\n- **Phase 2** (Weeks 5-8): Core implementation\n- **Phase 3** (Weeks 9-12): Testing, optimization, and deployment\n\n## Expected Outcomes\n- 35% improvement in process efficiency\n- 20% reduction in operational costs\n- Enhanced team productivity and satisfaction\n\n## Budget Estimate\nTotal investment: $45,000 — $65,000 (depending on scope finalized in Phase 1)\n\n## Next Steps\nWe request approval to begin Phase 1 and schedule a kickoff meeting.`,

    report: `**Report:**\n\n# ${prompt}\n\n## Introduction\nThis report provides a comprehensive analysis of ${prompt}, examining current trends, challenges, and opportunities.\n\n## Methodology\nData was collected through a combination of primary research (interviews, surveys) and secondary analysis (industry reports, academic publications).\n\n## Findings\n1. **Trend Analysis:** The sector is experiencing rapid transformation driven by technological advances\n2. **Performance Metrics:** Organizations adopting modern practices show 40% better outcomes\n3. **Risk Assessment:** Key risks include regulatory changes and market volatility\n4. **Opportunity Mapping:** Three high-potential areas identified for strategic investment\n\n## Recommendations\n1. Accelerate digital transformation initiatives\n2. Invest in workforce development programs\n3. Establish partnerships with technology providers\n4. Implement robust monitoring and evaluation frameworks\n\n## Conclusion\nThe evidence strongly supports proactive engagement with emerging trends. Organizations that act now will be better positioned for long-term success.`,
  };

  return templates[action];
}
