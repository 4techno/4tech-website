import test from 'node:test';
import assert from 'node:assert/strict';
import {
  generateEngineeringAdvice,
  formatProjectBriefText,
  type ProjectBriefData
} from '../lib/ai-assistant';

test('AI assistant generates structured drone engineering advice', async () => {
  const result = await generateEngineeringAdvice('I want to build an autonomous quadcopter drone');
  assert.ok(result.content.length > 100);
  assert.ok(result.content.startsWith('Planning template'));
  assert.equal(result.provider, 'local-engine');
  assert.ok(result.briefData);
  assert.equal(result.briefData?.domain, 'Robotics & Autonomous Systems');
  assert.ok(result.briefData?.hardwareBOM.length >= 4);
  assert.ok(result.briefData?.architecture.length >= 3);
  assert.match(result.briefData?.estimatedBudgetINR || '', /pending scoped quotation/i);
  assert.ok(result.briefData?.hardwareBOM.every(item => /unpriced/i.test(item.estimatedCostINR)));
  assert.doesNotMatch(result.content, /18,500|500Hz|65°|10\.5V|under 2ms/);
});

test('AI assistant generates structured robotic arm engineering advice', async () => {
  const result = await generateEngineeringAdvice('Design a 6-DOF robotic arm with stepper motors and inverse kinematics');
  assert.ok(result.content.includes('Kinematics'));
  assert.ok(result.briefData);
  assert.equal(result.briefData?.domain, 'Robotics & Mechanisms');
  assert.ok(result.briefData?.estimatedBudgetINR.includes('₹'));
  assert.match(result.briefData?.suggestedTimeline || '', /to be agreed/i);
  assert.doesNotMatch(result.content, /1:10|sub-millimeter|under 2ms/);
});

test('AI assistant generates resonant wireless power transfer blueprint', async () => {
  const result = await generateEngineeringAdvice('Resonant wireless power transfer system with 150kHz coil');
  assert.ok(result.content.includes('Resonant'));
  assert.ok(result.briefData);
  assert.equal(result.briefData?.domain, 'RF & Power Electronics');
});

test('formatProjectBriefText creates clean printable brief with BOM and phases', () => {
  const sampleBrief: ProjectBriefData = {
    title: 'Precision IoT Vibration Monitor',
    domain: 'Connected Systems',
    architecture: ['Sensor -> ADC -> ESP32 -> MQTT'],
    hardwareBOM: [{ item: 'ADXL345', purpose: 'Vibration sensing', estimatedCostINR: '₹350' }],
    firmwareStack: ['FreeRTOS', 'MQTT Client'],
    developmentPhases: [{ phase: 'PoC', duration: '1 week', deliverable: 'Bench test' }],
    feasibilityNotes: 'Keep trace lengths short.',
    estimatedBudgetINR: '₹8,500',
    suggestedTimeline: '3 weeks'
  };

  const text = formatProjectBriefText(sampleBrief, 'Customer requested low power sleep.');
  assert.ok(text.includes('4TECH ENGINEERING PROJECT BRIEF'));
  assert.ok(text.includes('Precision IoT Vibration Monitor'));
  assert.ok(text.includes('ADXL345'));
  assert.ok(text.includes('Customer requested low power sleep.'));
  assert.ok(text.includes('Mohammed Vashir'));
  assert.ok(text.includes('Sabeel Ahamed'));
});
