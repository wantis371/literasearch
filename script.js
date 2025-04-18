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

        // 表单提交
        document.getElementById("queryForm").addEventListener("submit", function (event) {
            event.preventDefault(); // 阻止表单默认提交行为

            // 获取输入值
            const keywords = document.getElementById("keywords").value.trim();
            const excludeKeywords = document.getElementById("excludeKeywords").value.trim();
            const authors = document.getElementById("authors").value.trim();
            const startYear = document.getElementById("startYear").value.trim();
            const endYear = document.getElementById("endYear").value.trim();

            // 获取选中的期刊
            const selectedJournals = Array.from(document.querySelectorAll('input[name="journal"]:checked'))
                .map(checkbox => checkbox.value);

            // 判断是否选择了中文期刊
            const isChineseJournal = selectedJournals.some(journal => {
                const chineseJournals = document.querySelectorAll("#chinese-journals input[type='checkbox']");
                return Array.from(chineseJournals).map(cb => cb.value).includes(journal);
            });

            // 生成检索式
            const queryExpression = generateQueryExpression(keywords, excludeKeywords, authors, startYear, endYear, selectedJournals, isChineseJournal);

            // 显示检索式
            const queryResult = document.getElementById("queryResult");
            queryResult.innerHTML = `<strong>生成的检索式：</strong><br>${queryExpression}`;

            // 跳转到查询页面
            if (isChineseJournal) {
                window.open("https://kns.cnki.net/kns8s/AdvSearch?type=expert&classid=WD0FTY92&rlang=CHINESE", "_blank");
            } else {
                const queryUrl = generateGoogleScholarUrl(keywords, excludeKeywords, authors, startYear, endYear, selectedJournals);
                window.open(queryUrl, "_blank");
            }
        });

        // 生成检索式
        function generateQueryExpression(keywords, excludeKeywords, authors, startYear, endYear, journals, isChineseJournal) {
            let query = "";

            // 处理关键词
            if (keywords) {
                const keywordQuery = keywords.split(",").map(k => k.trim()).filter(k => k).map(k => `SU%='${k}'`).join("+");
                query += keywordQuery;
            }

            // 处理必须不包含的关键词
            if (excludeKeywords) {
                const excludeQuery = excludeKeywords.split(",").map(k => k.trim()).filter(k => k).map(k => `-SU%='${k}'`).join("");
                query += excludeQuery;
            }

            // 处理作者
            if (authors) {
                const authorQuery = authors.split(",").map(a => a.trim()).filter(a => a).map(a => isChineseJournal ? `AU='${a}'` : `author:"${a}"`).join(isChineseJournal ? "+" : " OR ");
                query += isChineseJournal ? `+${authorQuery}` : ` AND (${authorQuery})`;
            }

            // 处理期刊
            if (journals.length > 0) {
                const journalQuery = journals.map(journal => isChineseJournal ? `'${journal}'` : `source:${journal}`).join(isChineseJournal ? "+" : " OR ");
                query += isChineseJournal ? ` and LY%=(${journalQuery})` : ` AND (${journalQuery})`;
            }

            return query;
        }

        // 生成 Google Scholar 查询 URL
        function generateGoogleScholarUrl(keywords, excludeKeywords, authors, startYear, endYear, journals) {
            let query = "";

            // 处理关键词
            if (keywords) {
                const keywordQuery = keywords.split(",").map(k => k.trim()).filter(k => k).join("+");
                query += keywordQuery;
            }

            // 处理必须不包含的关键词
            if (excludeKeywords) {
                const excludeQuery = excludeKeywords.split(",").map(k => k.trim()).filter(k => k).map(k => `-${k}`).join("");
                query += excludeQuery;
            }

            // 处理作者
            if (authors) {
                const authorQuery = authors.split(",").map(a => a.trim()).filter(a => a).map(a => `author:"${a}"`).join(" OR ");
                query += ` AND (${authorQuery})`;
            }

            // 处理期刊
            if (journals.length > 0) {
                const journalQuery = journals.map(journal => `source:${journal}`).join(" OR ");
                query += ` AND (${journalQuery})`;
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
