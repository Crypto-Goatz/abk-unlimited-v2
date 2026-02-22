// ═══════════════════════════════════════════════════════════
// ABK Unlimited — Lead Scoring Engine (Full Automation)
// Single custom code action: scores + updates contact + tags + tasks
// ═══════════════════════════════════════════════════════════
//
// Input Properties needed:
//   contactId, contactEmail, contactPhone, contactSource,
//   contactTags, projectType, formSubmitted,
//   contactFirstName, locationId, apiKey, assignedUserId

const baseUrl = 'https://services.leadconnectorhq.com';
const headers = {
  'Authorization': 'Bearer ' + inputData.apiKey,
  'Version': '2021-07-28',
  'Content-Type': 'application/json'
};

// ── 1. SCORE CALCULATION ─────────────────────────────────

const score = { total: 0, factors: [] };

const sourceScores = {
  'google': 30, 'referral': 40, 'houzz': 35,
  'facebook': 20, 'instagram': 15, 'direct': 25,
  'yelp': 30, 'nextdoor': 25
};

const projectScores = {
  'kitchen': 35, 'bathroom': 30, 'full_remodel': 40,
  'flooring': 20, 'basement': 30, 'commercial': 45,
  'addition': 40, 'interior_design': 25
};

const source = (inputData.contactSource || '').toLowerCase();
if (sourceScores[source]) {
  score.total += sourceScores[source];
  score.factors.push('source:' + source + '(+' + sourceScores[source] + ')');
}

const project = (inputData.projectType || '').toLowerCase();
if (projectScores[project]) {
  score.total += projectScores[project];
  score.factors.push('project:' + project + '(+' + projectScores[project] + ')');
}

if (inputData.contactEmail) {
  score.total += 10;
  score.factors.push('has_email(+10)');
}
if (inputData.contactPhone) {
  score.total += 15;
  score.factors.push('has_phone(+15)');
}
if (inputData.formSubmitted === 'true') {
  score.total += 10;
  score.factors.push('form_submitted(+10)');
}

// ── 2. GRADE ASSIGNMENT ──────────────────────────────────

let grade = 'D';
if (score.total >= 80) grade = 'A';
else if (score.total >= 60) grade = 'B';
else if (score.total >= 40) grade = 'C';

const priority = grade === 'A' ? 'HIGH' : grade === 'B' ? 'MEDIUM' : 'LOW';
const recommendedAction = grade === 'A'
  ? 'Call within 5 minutes'
  : grade === 'B'
    ? 'Call within 1 hour'
    : 'Email nurture sequence';

// ── 3. UPDATE CONTACT — Custom Fields + Tags ─────────────

const contactId = inputData.contactId;
const firstName = inputData.contactFirstName || 'Lead';

const tagList = [
  'ABK Lead',
  'Grade ' + grade,
  'Priority ' + priority
];
if (project) tagList.push(project);

try {
  await axios({
    method: 'PUT',
    url: baseUrl + '/contacts/' + contactId,
    headers: headers,
    data: {
      tags: tagList,
      customFields: [
        { key: 'lead_score', field_value: String(score.total) },
        { key: 'lead_grade', field_value: grade },
        { key: 'lead_priority', field_value: priority },
        { key: 'recommended_action', field_value: recommendedAction },
        { key: 'scoring_factors', field_value: score.factors.join(', ') },
        { key: 'scored_at', field_value: new Date().toISOString() }
      ]
    }
  });
} catch (e) {
  // Contact update failed — continue to output results anyway
}

// ── 4. CREATE TASK — Grade A & B only ────────────────────

let taskCreated = false;

if (grade === 'A' || grade === 'B') {
  const dueDate = new Date();
  if (grade === 'B') dueDate.setHours(dueDate.getHours() + 1);

  const taskTitle = grade === 'A'
    ? 'HOT LEAD — Call ' + firstName + ' NOW (Score: ' + score.total + ')'
    : 'Follow up with ' + firstName + ' within 1hr (Score: ' + score.total + ')';

  try {
    await axios({
      method: 'POST',
      url: baseUrl + '/contacts/' + contactId + '/tasks',
      headers: headers,
      data: {
        title: taskTitle,
        body: 'Grade ' + grade + ' lead from ' + source + '. Project: ' + project + '. ' + recommendedAction + '.',
        dueDate: dueDate.toISOString(),
        completed: false,
        assignedTo: inputData.assignedUserId || undefined
      }
    });
    taskCreated = true;
  } catch (e) {
    // Task creation failed — continue
  }
}

// ── 5. ADD TO NURTURE WORKFLOW — Grade C & D ─────────────

let nurtureAdded = false;

if ((grade === 'C' || grade === 'D') && inputData.nurtureWorkflowId) {
  try {
    await axios({
      method: 'POST',
      url: baseUrl + '/contacts/' + contactId + '/workflow/' + inputData.nurtureWorkflowId,
      headers: headers,
      data: {
        eventStartTime: new Date().toISOString()
      }
    });
    nurtureAdded = true;
  } catch (e) {
    // Workflow enrollment failed — continue
  }
}

// ── 6. OUTPUT ────────────────────────────────────────────

output = {
  leadScore: score.total,
  leadGrade: grade,
  priority: priority,
  scoringFactors: score.factors.join(', '),
  recommendedAction: recommendedAction,
  contactUpdated: true,
  taskCreated: taskCreated,
  nurtureAdded: nurtureAdded,
  tagsApplied: tagList.join(', ')
};
