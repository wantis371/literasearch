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
    const queryExpression = generateQueryExpression(keywords, excludeKeywords, authors, selectedJournals, isChineseJournal, isPrecise);

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
function generateQueryExpression(keywords, excludeKeywords, authors, journals, isChineseJournal, isPrecise) {
    let query = "";

    // 处理关键词
    if (keywords) {
        const keywordList = keywords.split(",").map(k => k.trim()).filter(k => k);
        if (isChineseJournal) {
            query += isPrecise ? `SU=('${keywordList.join("' * '")}')` : `SU%=('${keywordList.join("' + '")}')`;
        } else {
            query += isPrecise ? `("${keywordList.join('" and "')}")` : `(${keywordList.join(" and ")})`;
        }
    }

    // 处理排除关键词
    if (excludeKeywords) {
        const excludeKeywordList = excludeKeywords.split(",").map(k => k.trim()).filter(k => k);
        if (isChineseJournal) {
            query += ` - ('${excludeKeywordList.join("', '")}')`;
        } else {
            query += ` not "${excludeKeywordList.join('" not "')}"`;
        }
    }

    // 处理作者
    if (authors) {
        const authorList = authors.split(",").map(a => a.trim()).filter(a => a);
        if (isChineseJournal) {
            query += isPrecise ? ` and AU='${authorList.join("', '")}'` : ` and AU%='${authorList.join("', '")}'`;
        } else {
            query += ` AND (author:"${authorList.join('" OR author:"')}")`;
        }
    }

    // 处理期刊
    if (journals.length > 0) {
        const journalList = journals.map(journal => {
            if (isChineseJournal) {
                return isPrecise ? `'${journal}'` : `'${journal}'`;
            } else {
                return isPrecise ? `source:"${journal}"` : `source:${journal}`;
            }
        }).join(isPrecise ? " AND " : " OR ");
        query += isChineseJournal ? ` and LY=(${journalList})` : ` OR (${journalList})`;
    }

    return query;
}

// 生成 Google Scholar 查询 URL
function generateGoogleScholarUrl(keywords, excludeKeywords, authors, startYear, endYear, journals, otherJournals, isPrecise) {
    let query = "";

    // 处理关键词
    if (keywords) {
        const keywordList = keywords.split(",").map(k => k.trim()).filter(k => k);
        query += isPrecise ? `"${keywordList.join('" AND "')}"` : keywordList.join(" OR ");
    }

    // 处理排除关键词
    if (excludeKeywords) {
        const excludeKeywordList = excludeKeywords.split(",").map(k => k.trim()).filter(k => k);
        query += isPrecise ? ` NOT "${excludeKeywordList.join('" NOT "')}"` : ` -${excludeKeywordList.join(" NOT ")}`;
    }

    // 处理作者
    if (authors) {
        const authorList = authors.split(",").map(a => a.trim()).filter(a => a);
        query += isPrecise ? ` AND author:"${authorList.join('" OR author:"')}"` : ` AND author:${authorList.join(" OR author:")}`;
    }

    // 处理期刊
    if (journals.length > 0) {
        const journalList = journals.map(journal => {
            return isPrecise ? `source:"${journal}"` : `source:${journal}`;
        }).join(" OR ");
        query += ` AND (${journalList})`;
    }

    // 处理其他期刊
    if (otherJournals) {
        const otherJournalList = otherJournals.split(",").map(j => j.trim()).filter(j => j);
        query += isPrecise ? ` AND source:"${otherJournalList.join('" OR source:"')}"` : ` AND source:${otherJournalList.join(" OR source:")}`;
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
