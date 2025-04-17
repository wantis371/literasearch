
        // 全选功能
        document.getElementById("selectAllUTD24").addEventListener("change", function () {
            const checkboxes = document.querySelectorAll("#utd24-journals input[type='checkbox']");
            checkboxes.forEach(checkbox => checkbox.checked = this.checked);
        });

        document.getElementById("selectAllFT50").addEventListener("change", function () {
            const checkboxes = document.querySelectorAll("#ft50-journals input[type='checkbox']");
            checkboxes.forEach(checkbox => checkbox.checked = this.checked);
        });

        // 表单提交
        document.getElementById("queryForm").addEventListener("submit", function (event) {
            event.preventDefault(); // 阻止表单默认提交行为

            // 获取输入值
            const keywords = document.getElementById("keywords").value;
            const startYear = document.getElementById("startYear").value;
            const endYear = document.getElementById("endYear").value;

            // 获取选中的期刊
            const selectedJournals = Array.from(document.querySelectorAll('input[name="journal"]:checked'))
                .map(checkbox => checkbox.value);

            // 判断是否选择了中文期刊
            const isChineseJournal = selectedJournals.some(journal => {
                const chineseJournals = document.querySelectorAll("#chinese-journals input[type='checkbox']");
                return Array.from(chineseJournals).map(cb => cb.value).includes(journal);
            });

            // 生成查询 URL
            const queryUrl = generateQueryUrl(keywords, startYear, endYear, selectedJournals, isChineseJournal);

            // 跳转到查询页面
            window.open(queryUrl, "_blank");
        });

        function generateQueryUrl(keywords, startYear, endYear, journals, isChineseJournal) {
            let query = keywords;

            // 如果是中文期刊，跳转到知网
            if (isChineseJournal) {
                const journalQuery = journals.join(" ");
                return `https://kns.cnki.net/kns8/defaultresult/index?kw=${encodeURIComponent(query)} ${encodeURIComponent(journalQuery)}`;
            }

            // 否则跳转到 Google Scholar
            if (journals.length > 0) {
                const journalQuery = journals.map(journal => `SO=(${journal})`).join(" OR ");
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
