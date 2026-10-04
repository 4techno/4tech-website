import test from 'node:test';
import assert from 'node:assert/strict';
import {
  clearPlannerBrief,
  createPlannerBrief,
  draftFromContact,
  formatPlannerRequest,
  plannerBriefChangedEvent,
  plannerBriefStorageKey,
  readPlannerBrief,
  savePlannerBrief,
  type PlannerBrief,
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

test('blocked browser storage does not crash the account or planner handoff', () => {
  const originalWindow = Object.getOwnPropertyDescriptor(globalThis, 'window');
  const blockedWindow = Object.defineProperty(new EventTarget(), 'sessionStorage', {
    get() { throw new DOMException('Storage access is blocked', 'SecurityError'); },
  });
  let changes = 0;
  blockedWindow.addEventListener(plannerBriefChangedEvent, () => { changes += 1; });
  Object.defineProperty(globalThis, 'window', { configurable: true, value: blockedWindow });
  try {
    const brief = createPlannerBrief(fields, now);
    assert.equal(savePlannerBrief(brief), false);
    assert.equal(readPlannerBrief(undefined, now), null);
    assert.doesNotThrow(() => clearPlannerBrief());
    assert.equal(changes, 0);
  } finally {
    if (originalWindow) Object.defineProperty(globalThis, 'window', originalWindow);
    else Reflect.deleteProperty(globalThis, 'window');
  }
});

test('saving and removing a planner brief refreshes an already open account', () => {
  const originalWindow = Object.getOwnPropertyDescriptor(globalThis, 'window');
  const browserWindow = Object.defineProperty(new EventTarget(), 'sessionStorage', { value: tabStorage() });
  Object.defineProperty(globalThis, 'window', { configurable: true, value: browserWindow });
  const received: Array<PlannerBrief | null> = [];
  browserWindow.addEventListener(plannerBriefChangedEvent, () => {
    received.push(readPlannerBrief(undefined, now));
  });
  try {
    const brief = createPlannerBrief(fields, now);
    assert.equal(savePlannerBrief(brief), true);
    assert.deepEqual(received, [brief]);
    clearPlannerBrief();
    assert.deepEqual(received, [brief, null]);
  } finally {
    if (originalWindow) Object.defineProperty(globalThis, 'window', originalWindow);
    else Reflect.deleteProperty(globalThis, 'window');
  }
});

test('oversized or empty project goals are rejected before handoff', () => {
  assert.throws(() => createPlannerBrief({ ...fields, goal: '' }, now));
  assert.throws(() => createPlannerBrief({ ...fields, openQuestions: 'x'.repeat(801) }, now));
});

test('homepage contact form creates a reviewable draft, not a submitted or locally faked order', () => {
  const storage = tabStorage();
  const draft = createPlannerBrief(draftFromContact({
    title: 'Bench RF measurement rig', domain: 'RF & instrumentation',
    timeline: 'Flexible', message: 'Measure the relative antenna response over an angular sweep.',
  }), now);
  assert.equal(draft.source, 'direct');
  assert.equal(savePlannerBrief(draft, storage), true);
  assert.deepEqual(readPlannerBrief(storage, now), draft);
  const request = formatPlannerRequest(draft);
  assert.equal(request.category, 'Something else');
  assert.match(request.details, /Engineering domain: RF & instrumentation/);
  assert.match(request.details, /Project scope: Measure the relative antenna response/);
  assert.doesNotMatch(request.details, /AI concept|local worksheet/);
  assert.throws(() => draftFromContact({ ...draft, domain: 'Unrecognized domain', message: draft.goal }));
});
