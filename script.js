        const topJournals = [
            "Academy of Management Journal",
            "Academy of Management Review",
            "Accounting, Organizations and Society",
            "Administrative Science Quarterly",
            "American Economic Review",
            "Contemporary Accounting Research",
            "Econometrica",
            "Entrepreneurship Theory and Practice",
            "Harvard Business Review",
            "Human Relations",
            "Human Resource Management",
            "Information Systems Research",
            "Journal of Accounting and Economics",
            "Journal of Accounting Research",
            "Journal of Applied Psychology",
            "Journal of Business Ethics",
            "Journal of Business Venturing",
            "Journal of Consumer Psychology",
            "Journal of Consumer Research",
            "Journal of Finance",
            "Journal of Financial and Quantitative Analysis",
            "Journal of Financial Economics",
            "Journal of International Business Studies",
            "Journal of Management",
            "Journal of Management Information Systems",
            "Journal of Management Studies",
            "Journal of Marketing",
            "Journal of Marketing Research",
            "Journal of Operations Management",
            "Journal of Political Economy",
            "Journal of the Academy of Marketing Science",
            "Management Science",
            "M&SOM-MANUFACTURING & SERVICE OPERATIONS MANAGEMENT",
            "Marketing Science",
            "MIS Quarterly",
            "Operations Research",
            "Organization Science",
            "Organization Studies",
            "Organizational Behavior and Human Decision Processes",
            "Production and Operations Management",
            "Quarterly Journal of Economics",
            "Research Policy",
            "Review of Accounting Studies",
            "Review of Economic Studies",
            "Review of Finance",
            "Sloan Management Review",
            "Strategic Entrepreneurship Journal",
            "Strategic Management Journal",
            "The Accounting Review",
            "INFORMS Journal on Computing",
            "Review of Financial Studies"
        ];

        const commonJournals = [
            "Strategic Management Journal",
            "Journal of Marketing",
            "Journal of Marketing Research",
            "Journal of Operations Management",
            "Production and Operations Management",
            "Harvard Business Review",
            "Management Science",
            "M&SOM-MANUFACTURING & SERVICE OPERATIONS MANAGEMENT",
            "Marketing Science",
            "OMEGA-INTERNATIONAL JOURNAL OF MANAGEMENT SCIENCE",
            "International Journal of Production Research",
            "International Journal of Production Economics",
            "IEEE Transactions on Engineering Management",
            "European Journal of Operational Research",
            "Computers & Operations Research",
            "Annals of Operations Research",
            "Transportation Research Part*",
            "Transportation Science"
        ];

        document.getElementById("queryForm").addEventListener("submit", function (event) {
            event.preventDefault(); // 阻止表单默认提交行为

            // 获取输入值
            const keywords = document.getElementById("keywords").value;
            const startYear = document.getElementById("startYear").value;
            const endYear = document.getElementById("endYear").value;
            const journalType = document.getElementById("journalType").value;

            // 根据期刊分类选择期刊列表
            const journals = journalType === "top" ? topJournals : commonJournals;

            // 生成查询 URL
            const queryUrl = generateQueryUrl(keywords, startYear, endYear, journals);

            // 跳转到 Google Scholar
            window.open(queryUrl, "_blank");
        });

        function generateQueryUrl(keywords, startYear, endYear, journals) {
            let queryUrl = `https://scholar.google.com/scholar?q=${encodeURIComponent(keywords)}`;

            // 添加期刊过滤条件
            if (journals.length > 0) {
                const journalQuery = journals.map(journal => `SO=(${journal})`).join(" OR ");
                queryUrl += `&as_sdt=0,5&as_vis=1&q=${encodeURIComponent(journalQuery)}`;
            }

            // 添加年份范围
            if (startYear) {
                queryUrl += `&as_ylo=${startYear}`;
            }
            if (endYear) {
                queryUrl += `&as_yhi=${endYear}`;
            }

            return queryUrl;
        }
