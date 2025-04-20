// 全选功能
document.getElementById("selectAllUTD24").addEventListener("change", function () {
    const checkboxes = document.querySelectorAll("#utd24-journals input[type='checkbox']");
    checkboxes.forEach(checkbox => checkbox.checked = this.checked);
});

document.getElementById("selectAllFT50").addEventListener("change", function () {
    const checkboxes = document.querySelectorAll("#ft50-journals input[type='checkbox']");
    checkboxes.forEach(checkbox => checkbox.checked = this.checked);
});

document.getElementById("selectAllCommon").addEventListener("change", function () {
    const checkboxes = document.querySelectorAll("#common-journals input[type='checkbox']");
    checkboxes.forEach(checkbox => checkbox.checked = this.checked);
});

document.getElementById("selectAllChinese").addEventListener("change", function () {
    const checkboxes = document.querySelectorAll("#chinese-journals input[type='checkbox']");
    checkboxes.forEach(checkbox => checkbox.checked = this.checked);
});

// 复制功能
document.getElementById("copyButton").addEventListener("click", function () {
    const queryText = document.getElementById("queryText").innerText;
    navigator.clipboard.writeText(queryText).then(() => {
        alert("检索式已复制到剪贴板！");
    }).catch(() => {
        alert("复制失败，请手动复制。");
    });
});

// 精准查询按钮
document.getElementById("preciseQueryButton").addEventListener("click", function () {
    handleQuery(true); // true 表示精准查询
});

// 模糊查询按钮
document.getElementById("fuzzyQueryButton").addEventListener("click", function () {
    handleQuery(false); // false 表示模糊查询
});

// 处理查询
function handleQuery(isPrecise) {
    // 获取输入值
    const keywords = document.getElementById("keywords").value.trim();
    const excludeKeywords = document.getElementById("excludeKeywords").value.trim();
    const authors = document.getElementById("authors").value.trim();
    const startYear = document.getElementById("startYear").value.trim();
    const endYear = document.getElementById("endYear").value.trim();
    const otherJournals = document.getElementById("otherJournals").value.trim();

    // 获取选中的期刊
    const selectedJournals = Array.from(document.querySelectorAll('input[name="journal"]:checked'))
        .map(checkbox => checkbox.value);

    // 判断是否选择了中文期刊
    const isChineseJournal = selectedJournals.some(journal => {
        const chineseJournals = document.querySelectorAll("#chinese-journals input[type='checkbox']");
        return Array.from(chineseJournals).map(cb => cb.value).includes(journal);
    });

    // 生成检索式
    const queryExpression = generateQueryExpression(keywords, excludeKeywords, authors, startYear, endYear, selectedJournals, isChineseJournal, otherJournals, isPrecise);

    // 显示检索式
    document.getElementById("queryText").innerText = queryExpression;

    // 跳转到查询页面
    if (isChineseJournal) {
        window.open("https://kns.cnki.net/kns8s/AdvSearch?type=expert&classid=WD0FTY92&rlang=CHINESE", "_blank");
    } else {
        const queryUrl = generateGoogleScholarUrl(keywords, excludeKeywords, authors, startYear, endYear, selectedJournals, otherJournals, isPrecise);
        window.open(queryUrl, "_blank");
    }
}

// 生成检索式
function generateQueryExpression(keywords, excludeKeywords, authors, startYear, endYear, journals, isChineseJournal, otherJournals, isPrecise) {
    let query = "";

    // 处理关键词
    if (keywords) {
        const keywordQuery = keywords.split(",").map(k => k.trim()).filter(k => k).map(k => {
            if (isChineseJournal) {
                return isPrecise ? `SU='${k}'` : `SU%='${k}'`;
            } else {
                return isPrecise ? `"${k}"` : k;
            }
        }).join(isPrecise ? " AND " : " OR ");
        query += keywordQuery;
    }

    // 处理必须不包含的关键词
    if (excludeKeywords) {
        const excludeQuery = excludeKeywords.split(",").map(k => k.trim()).filter(k => k).map(k => {
            if (isChineseJournal) {
                return isPrecise ? `-SU='${k}'` : `-SU%='${k}'`;
            } else {
                return isPrecise ? `-"${k}"` : `-${k}`;
            }
        }).join("");
        query += excludeQuery;
    }

    // 处理作者
    if (authors) {
        const authorQuery = authors.split(",").map(a => a.trim()).filter(a => a).map(a => {
            if (isChineseJournal) {
                return isPrecise ? `AU='${a}'` : `AU%='${a}'`;
            } else {
                return isPrecise ? `author:"${a}"` : `author:${a}`;
            }
        }).join(isPrecise ? " AND " : " OR ");
        query += isChineseJournal ? `+${authorQuery}` : ` AND (${authorQuery})`;
    }

    // 处理期刊
    if (journals.length > 0) {
        const journalQuery = journals.map(journal => {
            if (isChineseJournal) {
                return isPrecise ? `'${journal}'` : `'${journal}'`;
            } else {
                return isPrecise ? `source:"${journal}"` : `source:${journal}`;
            }
        }).join(isPrecise ? " AND " : " OR ");
        query += isChineseJournal ? ` and LY%=(${journalQuery})` : ` AND (${journalQuery})`;
    }

    // 处理其他期刊
    if (otherJournals) {
        const otherJournalQuery = otherJournals.split(",").map(j => j.trim()).filter(j => j).map(j => {
            return isPrecise ? `source:"${j}"` : `source:${j}`;
        }).join(isPrecise ? " AND " : " OR ");
        query += ` AND (${otherJournalQuery})`;
    }

    return query;
}

// 生成 Google Scholar 查询 URL
function generateGoogleScholarUrl(keywords, excludeKeywords, authors, startYear, endYear, journals, otherJournals, isPrecise) {
    let query = "";

    // 处理关键词
    if (keywords) {
        const keywordQuery = keywords.split(",").map(k => k.trim()).filter(k => k).map(k => {
            return isPrecise ? `"${k}"` : k;
        }).join(isPrecise ? " AND " : " OR ");
        query += keywordQuery;
    }

    // 处理必须不包含的关键词
    if (excludeKeywords) {
        const excludeQuery = excludeKeywords.split(",").map(k => k.trim()).filter(k => k).map(k => {
            return isPrecise ? `-"${k}"` : `-${k}`;
        }).join("");
        query += excludeQuery;
    }

    // 处理作者
    if (authors) {
        const authorQuery = authors.split(",").map(a => a.trim()).filter(a => a).map(a => {
            return isPrecise ? `author:"${a}"` : `author:${a}`;
        }).join(isPrecise ? " AND " : " OR ");
        query += ` AND (${authorQuery})`;
    }

    // 处理期刊
    if (journals.length > 0) {
        const journalQuery = journals.map(journal => {
            return isPrecise ? `source:"${journal}"` : `source:${journal}`;
        }).join(isPrecise ? " AND " : " OR ");
        query += ` AND (${journalQuery})`;
    }

    // 处理其他期刊
    if (otherJournals) {
        const otherJournalQuery = otherJournals.split(",").map(j => j.trim()).filter(j => j).map(j => {
            return isPrecise ? `source:"${j}"` : `source:${j}`;
        }).join(isPrecise ? " AND " : " OR ");
        query += ` AND (${otherJournalQuery})`;
    }

    let queryUrl = `https://scholar.google.com/scholar?q=${encodeURIComponent(query)}`;

    // 添加年份范围
    if (startYear) {
        queryUrl += `&as_ylo=${startYear}`;
    }
    if (endYear) {
        queryUrl += `&as_yhi=${endYear}`;
    }

    return queryUrl;
}
