        document.getElementById("queryForm").addEventListener("submit", function (event) {
            event.preventDefault(); // 阻止表单默认提交行为

            // 获取输入值
            const keywords = document.getElementById("keywords").value;
            const startYear = document.getElementById("startYear").value;
            const endYear = document.getElementById("endYear").value;

            // 获取选中的期刊
            const selectedJournals = Array.from(document.querySelectorAll('input[name="journal"]:checked'))
                .map(checkbox => `SO=(${checkbox.value})`)
                .join(" OR ");

            // 生成查询 URL
            const queryUrl = generateQueryUrl(keywords, startYear, endYear, selectedJournals);

            // 跳转到 Google Scholar
            window.open(queryUrl, "_blank");
        });

        function generateQueryUrl(keywords, startYear, endYear, journals) {
            // 将关键词和期刊过滤条件合并
            let query = keywords;
            if (journals) {
                query += ` AND (${journals})`;
            }

            // 生成查询 URL
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
