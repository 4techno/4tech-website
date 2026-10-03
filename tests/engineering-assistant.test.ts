import test from 'node:test';
import assert from 'node:assert/strict';
import { assembleEngineeringReply, buildLocalEngineeringReply, calculateFlightTime, calculateFreeSpacePathLoss, calculateHoldingTorque, calculateLcResonance, validateEngineeringInput, validEngineeringModelReply, validEngineeringReply } from '../lib/engineering-contract';
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
  assert.doesNotMatch(JSON.stringify(answer), /sub-?2ms|Class 3|500\+|99\.4%|validated under laboratory/i);
});

test('explicit LC and free-space inputs produce dimensioned calculations, not performance claims', () => {
  assert.ok(Math.abs(calculateLcResonance({ inductanceH: 10e-6, capacitanceF: 100e-9 }) - 159154.943) < 0.01);
  assert.ok(Math.abs(calculateFreeSpacePathLoss({ distanceM: 100, frequencyHz: 2.4e9 }) - 80.052) < 0.01);
  const lc = buildLocalEngineeringReply('Calculate LC: L=10 uH, C=100 nF');
  assert.equal(lc.calculations[0]?.units, 'Hz');
  assert.equal(lc.calculations[0]?.result, '159155');
  assert.equal(validEngineeringReply(lc), true);
  const fspl = buildLocalEngineeringReply('Calculate FSPL: d=100 m, f=2.4 GHz');
  assert.equal(fspl.calculations[0]?.units, 'dB');
  assert.match(fspl.calculations[0]?.assumptions.join(' ') || '', /far-field/);
  assert.equal(validEngineeringReply(fspl), true);
  const missing = buildLocalEngineeringReply('Calculate LC at 150 kHz');
  assert.equal(missing.calculations.length, 0);
  assert.match(missing.questions[0], /provide both L and C/);
});

test('torque and flight time use only supplied loads, geometry and energy values', () => {
  const torqueInput = { armMassKg: 0.5, armCgM: 0.2, payloadMassKg: 0.3, reachM: 0.4, gearRatio: 10, gearEfficiency: 0.8, safetyFactor: 1.5 };
  assert.ok(Math.abs(calculateHoldingTorque(torqueInput) - 0.4045243125) < 1e-9);
  assert.ok(Math.abs(calculateFlightTime({ capacityMah: 1500, nominalVoltageV: 11.1, depthOfDischarge: 0.8, hoverPowerW: 100 }) - 7.992) < 1e-9);
  const torque = buildLocalEngineeringReply('Calculate holding torque: m_arm=0.5 kg, r_cg=0.2 m, m_payload=0.3 kg, reach=0.4 m, ratio=10, efficiency=0.8, sf=1.5');
  assert.equal(torque.calculations[0]?.units, 'N·m');
  assert.match(torque.calculations[0]?.assumptions.join(' ') || '', /static hold/);
  const flight = buildLocalEngineeringReply('Calculate flight time: capacity=1500 mAh, voltage=11.1 V, dod=0.8, power=100 W');
  assert.equal(flight.calculations[0]?.result, '7.992');
  assert.equal(flight.calculations[0]?.units, 'minutes');
  assert.equal(validEngineeringReply(flight), true);
});

test('invalid or absent physical inputs never produce a numeric answer', () => {
  assert.throws(() => calculateLcResonance({ inductanceH: 0, capacitanceF: 1e-9 }), /positive/);
  assert.throws(() => calculateFreeSpacePathLoss({ distanceM: -1, frequencyHz: 2.4e9 }), /positive/);
  assert.throws(() => calculateHoldingTorque({ armMassKg: 1, armCgM: 0.2, payloadMassKg: 1, reachM: 0.2, gearRatio: 10, gearEfficiency: 1.2, safetyFactor: 1 }), /Efficiency/);
  assert.throws(() => calculateFlightTime({ capacityMah: 1500, nominalVoltageV: 11.1, depthOfDischarge: 1.2, hoverPowerW: 100 }), /fraction/);
  assert.equal(buildLocalEngineeringReply('Calculate LC: L=-10 uH, C=100 nF').calculations.length, 0);
  assert.match(buildLocalEngineeringReply('Calculate LC: L=-10 uH, C=100 nF').questions[0], /Cannot calculate/);
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
