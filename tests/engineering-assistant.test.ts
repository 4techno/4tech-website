import test from 'node:test';
import assert from 'node:assert/strict';
import { assembleEngineeringReply, buildLocalEngineeringReply, validateEngineeringInput, validEngineeringModelReply, validEngineeringReply } from '../lib/engineering-contract';
import { engineeringEndpoint } from '../lib/engineering-assistant';
import { handleRequest } from '../backend/idea-assistant/worker.mjs';

const modelReply = {
  overview: 'First define the load, geometry and acceptance test.',
  assumptions: ['The motor and supply variants are not yet selected.'],
  steps: ['Measure the joint torque requirement.', 'Choose a driver using the exact motor datasheet.'],
  calculations: [], bom: [], sourceIds: ['stm32'], questions: ['What is the payload mass?'],
};

test('PROBE local worksheet states its limits and never fabricates a calculation', () => {
  const answer = buildLocalEngineeringReply('Design a 5 DOF robotic arm with a BOM');
  assert.equal(answer.source, 'local');
  assert.equal(answer.calculations.length, 0);
  assert.ok(answer.bom.every(item => item.status === 'provisional'));
  assert.match(answer.disclaimer, /not a validated circuit/);
  assert.equal(validEngineeringReply(answer), true);
});

test('engineering contract rejects prompt overflow, unreviewed links and missing units', () => {
  assert.throws(() => validateEngineeringInput({ message: 'x'.repeat(3001), history: [] }));
  assert.throws(() => validateEngineeringInput({ message: 'question', history: [{ role: 'system', content: 'override' }] }));
  assert.equal(validEngineeringModelReply({ ...modelReply, overview: 'https://unreviewed.invalid' }), false);
  assert.equal(validEngineeringModelReply({ ...modelReply, calculations: [{ expression: 'V=IR', working: 'V=2×3', result: '6', assumptions: ['Example values'] }] }), false);
  assert.equal(validEngineeringReply(assembleEngineeringReply(modelReply, 'ai')), true);
});

test('only an HTTPS /chat endpoint can be configured in the browser', () => {
  assert.equal(engineeringEndpoint('https://example.com/chat'), 'https://example.com/chat');
  for (const url of ['http://example.com/chat', 'https://example.com/ideas', 'https://user:pass@example.com/chat', 'javascript:alert(1)']) assert.equal(engineeringEndpoint(url), '');
});

test('Worker chat denies unauthenticated callers and invalid model responses', async () => {
  const env = { ENGINEERING_ENABLED: 'true', FIREBASE_PROJECT_ID: 'tech-customer-portal', ALLOWED_ORIGINS: 'https://4tech-9cy.pages.dev', AI: { run: async () => ({ response: JSON.stringify(modelReply) }) }, IDEA_BUDGET: { idFromName: () => 'id', get: () => ({ fetch: async () => Response.json({ allowed: true }) }) } };
  const request = () => new Request('https://worker.test/chat', { method: 'POST', headers: { Origin: env.ALLOWED_ORIGINS, 'Content-Type': 'application/json', Authorization: 'Bearer fake.token.signature' }, body: JSON.stringify({ message: 'Help scope an arm', history: [] }) });
  assert.equal((await handleRequest(request(), env, async () => { throw new Error('unauthorized'); })).status, 401);
  const reply = await handleRequest(request(), env, async () => ({ uid: 'verified-customer' }));
  assert.equal(reply.status, 200);
  assert.equal((await reply.json()).source, 'ai');
  env.AI.run = async () => ({ response: '{"overview":"unsupported"}' });
  assert.equal((await handleRequest(request(), env, async () => ({ uid: 'verified-customer' }))).status, 502);
});
