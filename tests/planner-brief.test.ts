import test from 'node:test';
import assert from 'node:assert/strict';
import {
  clearPlannerBrief,
  createPlannerBrief,
  formatPlannerRequest,
  plannerBriefStorageKey,
  readPlannerBrief,
  savePlannerBrief,
} from '../lib/planner-brief';

function tabStorage() {
  const values = new Map<string, string>();
  return {
    getItem: (key: string) => values.get(key) ?? null,
    setItem: (key: string, value: string) => { values.set(key, value); },
    removeItem: (key: string) => { values.delete(key); },
  };
}

const now = Date.parse('2026-10-03T12:00:00Z');
const fields = {
  source: 'local' as const,
  projectType: 'To be scoped',
  title: 'Autonomous inspection rover',
  goal: 'Inspect a small indoor test course using a camera and obstacle sensors.',
  constraints: 'Must fit through a 45 cm doorway.',
  timeline: 'Flexible',
  budgetRange: 'To be discussed',
  openQuestions: 'Which surfaces will it cross?',
  planningNotes: 'Prototype sensing and control before finalizing the chassis.',
};

test('planner handoff keeps a reviewed draft in tab storage and formats an editable enquiry', () => {
  const storage = tabStorage();
  const brief = createPlannerBrief(fields, now);
  assert.equal(savePlannerBrief(brief, storage), true);
  assert.deepEqual(readPlannerBrief(storage, now + 60_000), brief);
  const request = formatPlannerRequest(brief);
  assert.equal(request.title, fields.title);
  assert.match(request.details, /Budget range: To be discussed/);
  assert.match(request.details, /local worksheet, no AI or engineering validation/);
  clearPlannerBrief(storage);
  assert.equal(readPlannerBrief(storage, now), null);
});

test('expired or altered planner drafts cannot be carried into the customer form', () => {
  const storage = tabStorage();
  const brief = createPlannerBrief(fields, now);
  savePlannerBrief(brief, storage);
  assert.equal(readPlannerBrief(storage, now + 24 * 60 * 60 * 1000 + 1), null);
  storage.setItem(plannerBriefStorageKey, JSON.stringify({ ...brief, extra: 'unexpected' }));
  assert.equal(readPlannerBrief(storage, now), null);
  assert.equal(storage.getItem(plannerBriefStorageKey), null);
});

test('oversized or empty project goals are rejected before handoff', () => {
  assert.throws(() => createPlannerBrief({ ...fields, goal: '' }, now));
  assert.throws(() => createPlannerBrief({ ...fields, openQuestions: 'x'.repeat(801) }, now));
});
