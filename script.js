
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

            // 生成查询 URL
            const queryUrl = generateQueryUrl(keywords, excludeKeywords, startYear, endYear, selectedJournals, isChineseJournal);

            // 跳转到查询页面
            window.open(queryUrl, "_blank");
        });

        function generateQueryUrl(keywords, excludeKeywords, startYear, endYear, journals, isChineseJournal) {
            // 处理关键词（用逗号分隔）
            const keywordQuery = keywords.split(",").map(k => k.trim()).filter(k => k).map(k => `'${k}'`).join("+");
            let query = keywordQuery;

            // 处理必须不包含的关键词（用逗号分隔）
            if (excludeKeywords) {
                const excludeQuery = excludeKeywords.split(",").map(k => k.trim()).filter(k => k).map(k => `-'${k}'`).join("");
                query += excludeQuery;
            }

            // 如果是中文期刊，跳转到知网
            if (isChineseJournal) {
                const journalQuery = journals.map(journal => `'${journal}'`).join("+");
                return `https://kns.cnki.net/kns8s/AdvSearch?type=expert&classid=WD0FTY92&rlang=CHINESE&query=${encodeURIComponent(query)} and LY%=(${journalQuery})`;
            }

            // 否则跳转到 Google Scholar
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
