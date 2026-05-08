const state = {
  scenarios: [],
  coreScenarios: [],
  extensionScenarios: [],
  targetTools: [],
  rubric: [],
  questions: [],
  followUps: [],
  result: null,
  lessonSummary: null,
};

const nodes = {
  form: document.querySelector("#coach-form"),
  scenario: document.querySelector("#scenario"),
  targetTool: document.querySelector("#targetTool"),
  originalPrompt: document.querySelector("#originalPrompt"),
  extensionScenarioList: document.querySelector("#extension-scenario-list"),
  questionGroups: document.querySelector("#question-groups"),
  followUpQuestions: document.querySelector("#follow-up-questions"),
  followUpCount: document.querySelector("#follow-up-count"),
  generatedPrompt: document.querySelector("#generatedPrompt"),
  copyPrompt: document.querySelector("#copy-prompt"),
  loadSample: document.querySelector("#load-sample"),
  analyzeButton: document.querySelector("#analyze-button"),
  continueButton: document.querySelector("#continue-button"),
  requirementSummary: document.querySelector("#requirement-summary"),
  reviewBadge: document.querySelector("#review-badge"),
  originalScore: document.querySelector("#original-score"),
  structuredScore: document.querySelector("#structured-score"),
  generatedScore: document.querySelector("#generated-score"),
  dimensionScores: document.querySelector("#dimension-scores"),
  missingInfo: document.querySelector("#missing-info"),
  lessonRecord: document.querySelector("#lesson-record"),
  lessonSummary: document.querySelector("#lesson-summary"),
};

const levelNames = {
  1: "Level 1 目标与交付",
  2: "Level 2 上下文与材料",
  3: "Level 3 边界与约束",
  4: "Level 4 验收与汇报",
};

const sample = {
  scenario: "bugfix-debugging",
  targetTool: "Codex",
  originalPrompt: "帮我让 Codex 修复 npm run build 报错，不要乱改。",
  answers: {
    "l1-goal": "修复 npm run build 的 TypeScript 类型错误，并保持现有功能不变。",
    "l1-deliverable": "生成 coding agent prompt",
    "l2-working-directory": "F:/workspace/demo-app",
    "l2-tech-stack": "React + TypeScript + Vite，包管理器为 npm。",
    "l2-related-files": "package.json\nsrc/pages/Profile.tsx\nsrc/api/user.ts",
    "bugfix-error-log": "TS2322: Type 'undefined' is not assignable to type 'User'.",
    "bugfix-repro": "npm run build",
    "l3-scope": "只修改与 Profile 用户数据加载相关的文件。",
    "l3-forbidden": "不要全仓库格式化；不要新增依赖；不要删除测试。",
    "l4-verification": "npm run build\nnpm test -- --runInBand",
    "l4-report": ["根因", "修改文件", "关键改动", "验证命令与结果", "剩余风险"],
  },
};

async function requestJson(url, options) {
  const response = await fetch(url, {
    headers: { "content-type": "application/json" },
    ...options,
  });
  const payload = await response.json();
  if (!response.ok) {
    throw new Error(payload.error || "请求失败");
  }
  return payload;
}

function setOptions(select, options, getValue, getLabel) {
  select.replaceChildren();
  for (const option of options) {
    const element = document.createElement("option");
    element.value = getValue(option);
    element.textContent = getLabel(option);
    select.append(element);
  }
}

async function loadMetadata() {
  const metadata = await requestJson("/api/scenarios");
  state.scenarios = metadata.scenarios;
  state.coreScenarios = metadata.coreScenarios;
  state.extensionScenarios = metadata.extensionScenarios;
  state.targetTools = metadata.targetTools;
  state.rubric = metadata.scoringRubric;
  setOptions(
    nodes.scenario,
    state.coreScenarios,
    (item) => item.id,
    (item) => item.title,
  );
  setOptions(
    nodes.targetTool,
    state.targetTools,
    (item) => item,
    (item) => item,
  );
  renderExtensionScenarios();
  await loadQuestions();
  await loadLessonSummary();
}

function renderExtensionScenarios() {
  nodes.extensionScenarioList.replaceChildren();
  for (const scenario of state.extensionScenarios) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "scenario-pill";
    button.textContent = scenario.title;
    button.addEventListener("click", async () => {
      if (![...nodes.scenario.options].some((option) => option.value === scenario.id)) {
        const option = document.createElement("option");
        option.value = scenario.id;
        option.textContent = scenario.title;
        nodes.scenario.append(option);
      }
      nodes.scenario.value = scenario.id;
      await loadQuestions();
    });
    nodes.extensionScenarioList.append(button);
  }
}

async function loadQuestions() {
  const payload = await requestJson(`/api/questions?scenario=${encodeURIComponent(nodes.scenario.value)}`);
  state.questions = Object.values(payload.levels)
    .flat()
    .filter((question) => question.id !== "l0-task-type")
    .sort((a, b) => a.level - b.level || a.id.localeCompare(b.id));
  renderQuestions();
}

function renderQuestions() {
  nodes.questionGroups.replaceChildren();
  const byLevel = new Map();
  for (const question of state.questions) {
    if (!byLevel.has(question.level)) {
      byLevel.set(question.level, []);
    }
    byLevel.get(question.level).push(question);
  }

  for (const [level, questions] of [...byLevel.entries()].sort(([a], [b]) => a - b)) {
    const section = document.createElement("section");
    section.className = "question-level";
    const title = document.createElement("h3");
    title.textContent = levelNames[level] || `Level ${level}`;
    section.append(title);
    for (const question of questions) {
      section.append(renderQuestion(question));
    }
    nodes.questionGroups.append(section);
  }
}

function renderQuestion(question, source = "all") {
  const wrapper = document.createElement("div");
  wrapper.className = "question-item";
  wrapper.dataset.question = question.id;

  const title = document.createElement("div");
  title.className = "question-title";
  const text = document.createElement("span");
  text.textContent = question.question;
  title.append(text);
  if (question.required || source === "follow-up") {
    const required = document.createElement("span");
    required.className = "required-dot";
    required.textContent = source === "follow-up" ? "关键" : "必填";
    title.append(required);
  }
  wrapper.append(title);

  if (question.reasonText) {
    const reason = document.createElement("p");
    reason.className = "reason-text";
    reason.textContent = `为什么问：${question.reasonText}`;
    wrapper.append(reason);
  }

  if (question.exampleAnswer) {
    const example = document.createElement("p");
    example.className = "help-text";
    example.textContent = `示例：${question.exampleAnswer}`;
    wrapper.append(example);
  }

  if (question.scoringDimensions?.length) {
    const dims = document.createElement("p");
    dims.className = "help-text";
    dims.textContent = `影响维度：${question.scoringDimensions.join(", ")}`;
    wrapper.append(dims);
  }

  wrapper.append(renderQuestionField(question));

  if (question.helpText && !question.exampleAnswer) {
    const help = document.createElement("p");
    help.className = "help-text";
    help.textContent = question.helpText;
    wrapper.append(help);
  }

  return wrapper;
}

function renderQuestionField(question) {
  if (question.answerType === "single-choice") {
    const select = document.createElement("select");
    select.name = question.id;
    select.dataset.questionId = question.id;
    select.dataset.testid = question.id;
    const empty = document.createElement("option");
    empty.value = "";
    empty.textContent = "待选择";
    select.append(empty);
    for (const option of question.options || []) {
      const element = document.createElement("option");
      element.value = option;
      element.textContent = option;
      select.append(element);
    }
    return select;
  }

  if (question.answerType === "multi-choice") {
    const group = document.createElement("div");
    group.className = "choice-grid";
    group.dataset.questionId = question.id;
    group.dataset.testid = question.id;
    for (const option of question.options || []) {
      const label = document.createElement("label");
      const input = document.createElement("input");
      input.type = "checkbox";
      input.name = question.id;
      input.value = option;
      label.append(input, document.createTextNode(option));
      group.append(label);
    }
    return group;
  }

  const textarea = document.createElement("textarea");
  textarea.name = question.id;
  textarea.dataset.questionId = question.id;
  textarea.dataset.testid = question.id;
  textarea.rows = question.answerType === "log" ? 5 : 3;
  textarea.placeholder = question.helpText || question.fillsPromptField.join(", ");
  return textarea;
}

function collectAnswers() {
  const answers = {};
  const seen = new Set(state.questions.map((question) => question.id));
  for (const question of state.followUps) {
    if (!seen.has(question.id)) {
      state.questions.push(question);
    }
  }

  for (const question of state.questions) {
    if (question.answerType === "multi-choice") {
      const values = [...nodes.form.querySelectorAll(`input[name="${question.id}"]:checked`)].map(
        (input) => input.value,
      );
      if (values.length > 0) {
        answers[question.id] = values;
      }
      continue;
    }

    const field = nodes.form.elements.namedItem(question.id);
    if (field && field.value.trim()) {
      answers[question.id] = field.value.trim();
    }
  }
  return answers;
}

async function analyze() {
  const payload = {
    scenario: nodes.scenario.value,
    targetTool: nodes.targetTool.value,
    originalPrompt: nodes.originalPrompt.value,
    answers: collectAnswers(),
  };
  const result = await requestJson("/api/follow-up", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  state.followUps = result.followUpQuestions;
  renderScore(nodes.originalScore, result.score.totalScore);
  renderScore(nodes.structuredScore, result.score.totalScore);
  renderScore(nodes.generatedScore, "--");
  renderBadgeByScore(result.score.totalScore);
  renderDimensionScores(result.score);
  renderFollowUps();
  renderSummary(result.session);
  renderMissingFromScore(result.score);
}

function renderFollowUps() {
  nodes.followUpQuestions.replaceChildren();
  nodes.followUpCount.textContent = `${state.followUps.length}/3`;
  if (state.followUps.length === 0) {
    const empty = document.createElement("p");
    empty.className = "empty-state";
    empty.textContent = "当前没有关键追问，可以生成最终 Prompt。";
    nodes.followUpQuestions.append(empty);
    return;
  }

  for (const question of state.followUps) {
    nodes.followUpQuestions.append(renderQuestion(question, "follow-up"));
  }
}

async function evaluate(event) {
  event.preventDefault();
  const button = nodes.form.querySelector("button[type='submit']");
  button.disabled = true;
  button.textContent = "生成中";

  try {
    const payload = {
      scenario: nodes.scenario.value,
      targetTool: nodes.targetTool.value,
      originalPrompt: nodes.originalPrompt.value,
      answers: collectAnswers(),
    };
    state.result = await requestJson("/api/evaluate", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    renderResult(state.result);
  } catch (error) {
    renderError(error);
  } finally {
    button.disabled = false;
    button.textContent = "一键生成最终 Prompt";
  }
}

function renderResult(result) {
  nodes.generatedPrompt.value = result.generatedPrompt;
  nodes.copyPrompt.disabled = false;
  renderSummary(result.session);
  renderScore(nodes.originalScore, result.originalScore.totalScore);
  renderScore(nodes.structuredScore, result.structuredScore.totalScore);
  renderScore(nodes.generatedScore, result.generatedReview.score.totalScore);
  renderBadge(result.generatedReview.passed, result.generatedReview.score.totalScore);
  renderDimensionScores(result.generatedReview.score);
  renderMissingInfo(result);
  renderLesson(result);
}

function renderSummary(session) {
  const items = [
    ["任务目标", session.taskGoal || "待补充"],
    ["工作目录", session.workingDirectory || "待补充"],
    ["相关文件", (session.relatedFiles || []).join("；") || "待补充"],
    ["验证方式", (session.verificationCommands || []).join("；") || "待补充"],
  ];
  nodes.requirementSummary.className = "summary-grid";
  nodes.requirementSummary.replaceChildren(
    ...items.map(([label, value]) => {
      const item = document.createElement("div");
      item.className = "summary-item";
      const caption = document.createElement("span");
      caption.textContent = label;
      const content = document.createElement("strong");
      content.textContent = value;
      item.append(caption, content);
      return item;
    }),
  );
}

function renderScore(node, score) {
  node.textContent = `${score}`;
  if (score === "--") {
    node.style.background = "#eef3f2";
    return;
  }
  const color =
    score >= 85 ? "var(--good)" : score >= 70 ? "var(--usable)" : score >= 45 ? "var(--warn)" : "var(--danger)";
  node.style.background = `linear-gradient(135deg, ${color} 0%, ${color} 5px, #eef3f2 5px, #eef3f2 100%)`;
}

function renderBadgeByScore(score) {
  if (score >= 85) {
    nodes.reviewBadge.textContent = "高质量 Prompt";
    nodes.reviewBadge.className = "badge good";
  } else if (score >= 70) {
    nodes.reviewBadge.textContent = "可以生成 Prompt";
    nodes.reviewBadge.className = "badge usable";
  } else if (score >= 45) {
    nodes.reviewBadge.textContent = "需要继续澄清";
    nodes.reviewBadge.className = "badge warn";
  } else {
    nodes.reviewBadge.textContent = "不适合交给 agent";
    nodes.reviewBadge.className = "badge danger";
  }
}

function renderBadge(passed, score) {
  nodes.reviewBadge.textContent = passed ? "自审通过" : "需修订";
  nodes.reviewBadge.className = `badge ${passed && score >= 85 ? "good" : passed ? "usable" : "warn"}`;
}

function renderDimensionScores(score) {
  nodes.dimensionScores.replaceChildren();
  const rubricByKey = new Map(state.rubric.map((item) => [item.key, item]));
  for (const [key, value] of Object.entries(score.dimensionScores)) {
    const definition = rubricByKey.get(key);
    const row = document.createElement("div");
    row.className = "dimension-row";

    const label = document.createElement("div");
    label.className = "dimension-label";
    label.textContent = definition ? definition.label : key;

    const numeric = document.createElement("div");
    numeric.className = "dimension-score";
    numeric.textContent = `${value}/${definition?.maxScore ?? ""}`;

    const bar = document.createElement("div");
    bar.className = "dimension-bar";
    const fill = document.createElement("span");
    fill.style.width = `${Math.round((value / (definition?.maxScore || 1)) * 100)}%`;
    bar.append(fill);

    row.append(label, numeric, bar);
    nodes.dimensionScores.append(row);
  }
}

function renderMissingFromScore(score) {
  nodes.missingInfo.replaceChildren();
  const title = document.createElement("h3");
  title.textContent = "最缺失信息";
  const list = document.createElement("ul");
  for (const item of score.missingCriticalInfo.length ? score.missingCriticalInfo : ["关键阻塞信息已补齐。"]) {
    const li = document.createElement("li");
    li.textContent = item;
    list.append(li);
  }
  for (const warning of score.antiGamingWarnings || []) {
    const li = document.createElement("li");
    li.textContent = warning;
    list.append(li);
  }
  nodes.missingInfo.append(title, list);
}

function renderMissingInfo(result) {
  nodes.missingInfo.replaceChildren();
  const title = document.createElement("h3");
  title.textContent = "优先补充";
  const list = document.createElement("ul");
  const items =
    result.missingBlockingQuestions.length > 0
      ? result.missingBlockingQuestions.map((question) => question.question)
      : result.structuredScore.missingCriticalInfo;
  for (const item of items.slice(0, 5)) {
    const li = document.createElement("li");
    li.textContent = item;
    list.append(li);
  }
  if (items.length === 0) {
    const li = document.createElement("li");
    li.textContent = "关键阻塞信息已补齐。";
    list.append(li);
  }
  nodes.missingInfo.append(title, list);
}

function renderLesson(result) {
  nodes.lessonRecord.replaceChildren();
  const title = document.createElement("h3");
  title.textContent = "错题本候选";
  nodes.lessonRecord.append(title);

  if (!result.lessonCandidate) {
    const text = document.createElement("p");
    text.textContent = "生成 prompt 自审通过，当前没有新错题。";
    nodes.lessonRecord.append(text);
    return;
  }

  const list = document.createElement("ul");
  for (const item of [
    result.lessonCandidate.mistakeType,
    result.lessonCandidate.suggestedFix,
    `低分维度：${result.lessonCandidate.weakDimensions.join(", ")}`,
  ]) {
    const li = document.createElement("li");
    li.textContent = item;
    list.append(li);
  }
  const saveButton = document.createElement("button");
  saveButton.type = "button";
  saveButton.className = "secondary-button";
  saveButton.textContent = "写入错题本";
  saveButton.addEventListener("click", async () => {
    await requestJson("/api/lessons", {
      method: "POST",
      body: JSON.stringify({ lessonCandidate: result.lessonCandidate }),
    });
    await loadLessonSummary();
  });
  nodes.lessonRecord.append(list, saveButton);
}

async function loadLessonSummary() {
  state.lessonSummary = await requestJson("/api/lessons/summary");
  renderLessonSummary();
}

function renderLessonSummary() {
  nodes.lessonSummary.replaceChildren();
  const title = document.createElement("h3");
  title.textContent = "错题本统计";
  const summary = state.lessonSummary;
  const list = document.createElement("ul");
  const items = [
    `总记录数：${summary?.total ?? 0}`,
    `高频低分维度：${(summary?.topMissingInfo || []).join("；") || "暂无"}`,
    `建议：${(summary?.suggestions || []).slice(0, 3).join("；") || "暂无"}`,
  ];
  for (const item of items) {
    const li = document.createElement("li");
    li.textContent = item;
    list.append(li);
  }
  nodes.lessonSummary.append(title, list);
}

function renderError(error) {
  nodes.generatedPrompt.value = "";
  nodes.copyPrompt.disabled = true;
  nodes.reviewBadge.textContent = "失败";
  nodes.reviewBadge.className = "badge warn";
  nodes.missingInfo.replaceChildren();
  const title = document.createElement("h3");
  title.textContent = "请求失败";
  const text = document.createElement("p");
  text.textContent = error.message;
  nodes.missingInfo.append(title, text);
}

async function applySample() {
  nodes.scenario.value = sample.scenario;
  nodes.targetTool.value = sample.targetTool;
  nodes.originalPrompt.value = sample.originalPrompt;
  await loadQuestions();

  for (const [id, value] of Object.entries(sample.answers)) {
    const question = state.questions.find((item) => item.id === id);
    if (!question) {
      continue;
    }

    if (question.answerType === "multi-choice") {
      for (const checkbox of nodes.form.querySelectorAll(`input[name="${id}"]`)) {
        checkbox.checked = value.includes(checkbox.value);
      }
      continue;
    }

    const field = nodes.form.elements.namedItem(id);
    if (field) {
      field.value = value;
    }
  }
  await analyze();
}

nodes.scenario.addEventListener("change", loadQuestions);
nodes.form.addEventListener("submit", evaluate);
nodes.analyzeButton.addEventListener("click", () => analyze().catch(renderError));
nodes.continueButton.addEventListener("click", () => analyze().catch(renderError));
nodes.loadSample.addEventListener("click", () => applySample().catch(renderError));
nodes.copyPrompt.addEventListener("click", async () => {
  await navigator.clipboard.writeText(nodes.generatedPrompt.value);
  nodes.copyPrompt.textContent = "已复制";
  window.setTimeout(() => {
    nodes.copyPrompt.textContent = "复制";
  }, 1200);
});

loadMetadata().catch(renderError);
