// script.js
document.getElementById('searchForm').addEventListener('submit', function (event) {
  event.preventDefault(); // 阻止表单默认提交行为

  // 获取用户输入的关键词、期刊来源、作者和时间范围
  const keywords = document.getElementById('keywords').value.trim();
  const journalOptions = document.getElementById('journal').selectedOptions;
  const author = document.getElementById('author').value.trim();
  const startYear = document.getElementById('startYear').value.trim();
  const endYear = document.getElementById('endYear').value.trim();

  // 生成期刊查询语句
  const journals = Array.from(journalOptions).map(option => `source:${option.value}`).join(' OR ');

  // 生成完整查询语句
  let query = keywords;
  if (journals) query += ` (${journals})`;
  if (author) query += ` author:"${author}"`;
  if (startYear && endYear) query += ` ${startYear}-${endYear}`;
  else if (startYear) query += ` after:${startYear}`;
  else if (endYear) query += ` before:${endYear}`;

  // 构建 Google Scholar 查询 URL
  const googleScholarUrl = `https://scholar.google.com/scholar?q=${encodeURIComponent(query)}`;

  // 跳转到 Google Scholar
  window.location.href = googleScholarUrl;
});

// 期刊分类选择函数
function selectJournals(journalList) {
  const journalSelect = document.getElementById('journal');
  Array.from(journalSelect.options).forEach(option => {
    option.selected = journalList.includes(option.value);
  });
}
