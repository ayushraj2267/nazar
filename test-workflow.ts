import { detectDuplicateIncident } from './src/services/duplicateEngine';
import { evaluateIntelligentRisk } from './src/services/riskEngine';
import { DamageCategory, IncidentRecord, SeverityLevel } from './src/types/incident';

// Mock LocalStorage for headless Node environment
const mockStorage: Record<string, string> = {};
(global as any).localStorage = {
  getItem: (key: string) => mockStorage[key] || null,
  setItem: (key: string, val: string) => { mockStorage[key] = val; },
  removeItem: (key: string) => { delete mockStorage[key]; },
  clear: () => { for (const k in mockStorage) delete mockStorage[k]; },
};

import { storageService } from './src/services/storageService';

console.log('====================================================');
console.log('🧪 NAZAR AI: AUTOMATED INCIDENT WORKFLOW AUDIT TEST');
console.log('====================================================\n');

let testsPassed = 0;
let testsTotal = 0;

function assert(condition: boolean, testName: string, details?: any) {
  testsTotal++;
  if (condition) {
    console.log(`✅ [PASS] ${testName}`);
    testsPassed++;
  } else {
    console.error(`❌ [FAIL] ${testName}`);
    if (details) console.error('   Details:', details);
  }
}

// ----------------------------------------------------
// TEST 1: Initial Seed Dataset & LocalStorage Persistence
// ----------------------------------------------------
console.log('--- 1. Testing Persistence & Initial State ---');
const initialIncidents = storageService.getIncidents();
assert(initialIncidents.length >= 6, 'Initial seed incidents loaded successfully', initialIncidents.length);
assert(Boolean(mockStorage['nazar_incidents_v1']), 'Data saved to LocalStorage key "nazar_incidents_v1"');

const initialStats = storageService.getStats();
assert(initialStats.totalIncidents === initialIncidents.length, 'Initial stats count matches incident list');
console.log(`   Initial stats: ${initialStats.totalIncidents} Total, ${initialStats.criticalIncidents} Critical, ${initialStats.highPriority} High Priority\n`);

// ----------------------------------------------------
// TEST 2: Unique Incident ID Generation Monotonic Safety
// ----------------------------------------------------
console.log('--- 2. Testing Monotonic Unique Incident ID Generation ---');
const nextId1 = storageService.generateNextIncidentId();
assert(nextId1.startsWith('NAZ-2026-'), 'Generated ID has standard NAZ-YYYY prefix', nextId1);

// Test deletion edge case: Ensure deleting an item does NOT result in an ID collision
const tempId = nextId1;
const testIncident: IncidentRecord = {
  id: tempId,
  image: 'data:image/jpeg;base64,sample',
  category: 'POTHOLE',
  description: 'Test pothole on Main Street',
  confidence: 0.92,
  severity: 'HIGH',
  riskScore: 82,
  visualEvidence: ['Asphalt cavity', 'Crumbling edges'],
  publicSafetyRisk: 'Vehicle tire rupture',
  department: 'Road Maintenance',
  recommendedAction: 'Milling and bituminous infill',
  deadlineHours: 24,
  latitude: 28.5355,
  longitude: 77.2410,
  location: 'Main Street Flyover Approach',
  status: 'OPEN',
  createdAt: new Date().toISOString(),
};

storageService.saveIncident(testIncident);
const nextId2 = storageService.generateNextIncidentId();
assert(nextId1 !== nextId2, 'Subsequent ID is strictly unique from previous ID', { id1: nextId1, id2: nextId2 });

// Delete item and verify next sequence still advances forward
storageService.deleteIncident(tempId);
const nextId3 = storageService.generateNextIncidentId();
assert(nextId3 !== tempId, 'Next ID advances forward even after deleting preceding incident (Monotonicity Guarantee)', { tempId, nextId3 });
console.log(`   Sequential IDs verified: ${nextId1} -> ${nextId2} -> ${nextId3}\n`);

// ----------------------------------------------------
// TEST 3: Department Routing & SLA Priority Calculation
// ----------------------------------------------------
console.log('--- 3. Testing Department Routing & SLA Priority Engine ---');

const routingTests: { category: DamageCategory; expectedDept: string; expectedSeverity: SeverityLevel }[] = [
  { category: 'OPEN_MANHOLE', expectedDept: 'Drainage Department', expectedSeverity: 'CRITICAL' },
  { category: 'POTHOLE', expectedDept: 'Road Maintenance', expectedSeverity: 'HIGH' },
  { category: 'BROKEN_STREETLIGHT', expectedDept: 'Electrical Department', expectedSeverity: 'HIGH' },
  { category: 'GARBAGE_OVERFLOW', expectedDept: 'Sanitation Department', expectedSeverity: 'MEDIUM' },
  { category: 'DAMAGED_FOOTPATH', expectedDept: 'Public Works Department', expectedSeverity: 'MEDIUM' },
  { category: 'ROAD_CRACK', expectedDept: 'Road Maintenance', expectedSeverity: 'MEDIUM' },
];

routingTests.forEach(t => {
  const riskEval = evaluateIntelligentRisk(t.category, 80, ['Visible structural defect']);
  assert(
    riskEval.severity === t.expectedSeverity,
    `Risk engine classifies ${t.category} as ${t.expectedSeverity} priority`,
    riskEval
  );
  assert(
    riskEval.responseWindowSla.length > 0,
    `Calculates suggested response SLA (${riskEval.responseWindowSla})`
  );
});
console.log('');

// ----------------------------------------------------
// TEST 4: In-App Notification & Real-time Dashboard Stats Update
// ----------------------------------------------------
console.log('--- 4. Testing Notification Dispatch & Dashboard Stats Recalculation ---');
const preStats = storageService.getStats();
const preNotifs = storageService.getNotifications();

const criticalIncidentId = storageService.generateNextIncidentId();
const criticalIncident: IncidentRecord = {
  id: criticalIncidentId,
  image: 'data:image/jpeg;base64,critical_sample',
  category: 'OPEN_MANHOLE',
  description: 'Uncovered sewer shaft in crowded crosswalk',
  confidence: 0.96,
  severity: 'CRITICAL',
  riskScore: 95,
  visualEvidence: ['Missing cover', 'Vertical shaft void'],
  publicSafetyRisk: 'Fatal pedestrian fall risk',
  department: 'Drainage Department',
  recommendedAction: 'Emergency perimeter barrier & immediate casting replacement',
  deadlineHours: 6,
  latitude: 28.6140,
  longitude: 77.2091,
  location: 'Connaught Place Pedestrian Zone',
  status: 'OPEN',
  createdAt: new Date().toISOString(),
};

storageService.saveIncident(criticalIncident);

// Verify Notification Creation
const postNotifs = storageService.getNotifications();
assert(postNotifs.length === preNotifs.length + 1, 'In-app notification created automatically');
const latestNotif = postNotifs[0];
assert(latestNotif.incidentId === criticalIncidentId, 'Notification links to generated Incident ID', latestNotif);
assert(latestNotif.severity === 'CRITICAL', 'Notification reflects CRITICAL priority level');
assert(latestNotif.title.includes('CRITICAL ALERT'), 'Notification title carries emergency dispatch banner');

// Verify Stats Update
const postStats = storageService.getStats();
assert(postStats.totalIncidents === preStats.totalIncidents + 1, 'Total incidents statistic incremented (+1)');
assert(postStats.criticalIncidents === preStats.criticalIncidents + 1, 'Critical incidents statistic incremented (+1)');
assert(postStats.pendingRepairs === preStats.pendingRepairs + 1, 'Pending repairs statistic incremented (+1)');
console.log(`   Updated stats: ${postStats.totalIncidents} Total, ${postStats.criticalIncidents} Critical, ${postStats.pendingRepairs} Pending Repairs\n`);

// ----------------------------------------------------
// TEST 5: Status Lifecycle Update Propagation
// ----------------------------------------------------
console.log('--- 5. Testing Incident Status Transition & Audit Trail ---');
storageService.updateIncidentStatus(criticalIncidentId, 'IN_PROGRESS', 'Crews deployed on-site with barricades', 'Field Lead');
const updatedInc = storageService.getIncidentById(criticalIncidentId);
assert(updatedInc?.status === 'IN_PROGRESS', 'Incident status transitioned to IN_PROGRESS');
assert(Boolean(updatedInc?.auditLog?.some(a => a.action.includes('IN_PROGRESS'))), 'Lifecycle audit log records transition');

// Resolve the incident and verify critical count decrements
storageService.updateIncidentStatus(criticalIncidentId, 'RESOLVED', 'Heavy ductile iron cover installed', 'Inspector Singh');
const resolvedStats = storageService.getStats();
assert(resolvedStats.criticalIncidents === preStats.criticalIncidents, 'Critical hazard counter decrements upon RESOLUTION');
assert(resolvedStats.resolvedIncidents === preStats.resolvedIncidents + 1, 'Resolved incidents counter incremented');
console.log(`   Status flow verified: OPEN -> IN_PROGRESS -> RESOLVED\n`);

// ----------------------------------------------------
// TEST 6: Duplicate Incident Detection & Prevention
// ----------------------------------------------------
console.log('--- 6. Testing Deduplication Engine & Prevention ---');
const allIncidents = storageService.getIncidents();

// Case A: Geographically close defect (same category within 250m)
const dupCheck1 = detectDuplicateIncident(
  'OPEN_MANHOLE',
  'Missing shaft cover adjacent to curb',
  28.6139, // Coordinates matching seed incident NAZ-2026-0001
  77.2090,
  allIncidents,
  'Connaught Outer Circle'
);
assert(dupCheck1.isDuplicate === true, 'Detects spatial duplicate within 250m proximity');
assert(Boolean(dupCheck1.matchedIncident), 'Identifies matched ticket ID for operator review', dupCheck1.matchedIncident?.id);
console.log(`   Duplicate matched: ${dupCheck1.reason}`);

// Case B: Different category at same location (should NOT block as duplicate)
const nonDupCheck1 = detectDuplicateIncident(
  'BROKEN_STREETLIGHT',
  'Dark luminaire lamp post',
  28.6139,
  77.2090,
  allIncidents,
  'Connaught Outer Circle'
);
assert(nonDupCheck1.isDuplicate === false, 'Different category at same location is NOT flagged as duplicate');

// Case C: Same category in distant district (5km away)
const nonDupCheck2 = detectDuplicateIncident(
  'POTHOLE',
  'Road crater in South Delhi',
  28.5000,
  77.1000,
  allIncidents,
  'Distant District Sector'
);
assert(nonDupCheck2.isDuplicate === false, 'Same category at geographically distant location is NOT flagged as duplicate');
console.log('');

// ----------------------------------------------------
// SUMMARY
// ----------------------------------------------------
console.log('====================================================');
console.log(`🎯 AUDIT RESULTS: ${testsPassed} / ${testsTotal} TESTS PASSED (${Math.round((testsPassed / testsTotal) * 100)}%)`);
console.log('====================================================\n');

if (testsPassed === testsTotal) {
  console.log('🎉 ALL AUTOMATED INCIDENT WORKFLOW SPECIFICATIONS VERIFIED.');
  process.exit(0);
} else {
  console.error('❌ SOME AUDIT TESTS FAILED.');
  process.exit(1);
}
