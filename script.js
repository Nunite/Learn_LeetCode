document.addEventListener('DOMContentLoaded', function() {
    // 加载题目数据
    loadProblemsData();
    
    // 返回顶部按钮
    const scrollToTopBtn = document.createElement('button');
    scrollToTopBtn.innerHTML = '↑';
    scrollToTopBtn.className = 'scroll-to-top';
    scrollToTopBtn.style.position = 'fixed';
    scrollToTopBtn.style.bottom = '20px';
    scrollToTopBtn.style.right = '20px';
    scrollToTopBtn.style.width = '40px';
    scrollToTopBtn.style.height = '40px';
    scrollToTopBtn.style.fontSize = '20px';
    scrollToTopBtn.style.background = '#0066cc';
    scrollToTopBtn.style.color = 'white';
    scrollToTopBtn.style.border = 'none';
    scrollToTopBtn.style.borderRadius = '50%';
    scrollToTopBtn.style.cursor = 'pointer';
    scrollToTopBtn.style.display = 'none';
    scrollToTopBtn.style.zIndex = '1000';
    
    document.body.appendChild(scrollToTopBtn);
    
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            scrollToTopBtn.style.display = 'block';
        } else {
            scrollToTopBtn.style.display = 'none';
        }
    });
    
    scrollToTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // 移动端导航菜单
    const header = document.querySelector('header');
    if (header) {
        const nav = header.querySelector('nav');
        const menuBtn = document.createElement('button');
        menuBtn.className = 'menu-toggle';
        menuBtn.innerHTML = '☰';
        menuBtn.style.display = 'none';
        menuBtn.style.background = 'none';
        menuBtn.style.border = 'none';
        menuBtn.style.fontSize = '24px';
        menuBtn.style.cursor = 'pointer';
        menuBtn.style.color = '#2c3e50';
        
        header.querySelector('.container').insertBefore(menuBtn, nav);
        
        function toggleMenu() {
            if (nav.style.display === 'none' || nav.style.display === '') {
                nav.style.display = 'block';
            } else {
                nav.style.display = 'none';
            }
        }
        
        menuBtn.addEventListener('click', toggleMenu);
        
        function checkScreenSize() {
            if (window.innerWidth <= 768) {
                menuBtn.style.display = 'block';
                nav.style.display = 'none';
            } else {
                menuBtn.style.display = 'none';
                nav.style.display = 'block';
            }
        }
        
        window.addEventListener('resize', checkScreenSize);
        checkScreenSize();
    }
});

// 加载题目数据
async function loadProblemsData() {
    try {
        // 简化路径逻辑
        let dataPath = './data/problems.json';
        
        // 添加详细日志
        console.log('当前页面路径:', window.location.pathname);
        console.log('尝试加载数据路径:', dataPath);
        
        const response = await fetch(dataPath);
        
        // 添加详细的响应信息
        console.log('响应状态:', response.status, response.statusText);
        
        if (!response.ok) {
            throw new Error(`无法加载题目数据: ${response.status} ${response.statusText}`);
        }
        
        // 尝试解析JSON
        let problems;
        try {
            problems = await response.json();
            console.log('成功加载题目数据，题目数量:', problems.length);
        } catch (parseError) {
            console.error('JSON解析错误:', parseError);
            throw new Error('题目数据格式错误');
        }
        
        // 根据当前页面处理数据
        const currentPath = window.location.pathname;
        console.log('处理页面:', currentPath);
        
        if (currentPath.endsWith('/index.html') || currentPath.endsWith('/') || currentPath.includes('index')) {
            // 首页：显示精选题解
            console.log('渲染首页精选题解');
            renderFeaturedProblems(problems.slice(0, 3));
        } else if (currentPath.endsWith('/problems.html') || currentPath.includes('problems')) {
            // 题目列表页：显示所有题目
            console.log('渲染题目列表');
            renderProblemList(problems);
            setupProblemFilters();
        } else if (currentPath.includes('/solution.html') || currentPath.includes('solution')) {
            // 题解页：显示特定题目的解答
            console.log('渲染题解页面');
            const urlParams = new URLSearchParams(window.location.search);
            const problemId = urlParams.get('id');
            console.log('题目ID:', problemId);
            
            if (problemId) {
                const problem = problems.find(p => p.id === parseInt(problemId));
                if (problem) {
                    console.log('找到题目:', problem.title);
                    renderProblemSolution(problem);
                } else {
                    console.error('未找到题目ID:', problemId);
                    showErrorMessage('未找到该题目');
                }
            } else {
                console.error('未指定题目ID');
                showErrorMessage('未指定题目ID');
            }
        } else {
            console.log('未知页面类型:', currentPath);
        }
    } catch (error) {
        console.error('加载题目数据失败:', error);
        showErrorMessage(`加载题目数据失败: ${error.message}`);
    }
}

// 在首页渲染精选题解
function renderFeaturedProblems(problems) {
    const featuredSection = document.querySelector('.featured-problems');
    if (!featuredSection) return;
    
    const problemCardsContainer = featuredSection.querySelector('.problem-cards');
    if (!problemCardsContainer) return;
    
    problemCardsContainer.innerHTML = '';
    
    problems.forEach(problem => {
        const card = document.createElement('div');
        card.className = 'problem-card';
        
        card.innerHTML = `
            <h3>${problem.id}. ${problem.title}</h3>
            <span class="difficulty ${problem.difficulty}">${getDifficultyText(problem.difficulty)}</span>
            <p>${problem.content.description.substring(0, 100)}...</p>
            <a href="solution.html?id=${problem.id}" class="btn">查看解题</a>
        `;
        
        problemCardsContainer.appendChild(card);
    });
}

// 在题目列表页渲染所有题目
function renderProblemList(problems) {
    const problemTable = document.querySelector('.problem-table tbody');
    if (!problemTable) return;
    
    problemTable.innerHTML = '';
    
    problems.forEach(problem => {
        const row = document.createElement('tr');
        
        row.innerHTML = `
            <td>${problem.id}</td>
            <td>${problem.title}</td>
            <td><span class="difficulty ${problem.difficulty}">${getDifficultyText(problem.difficulty)}</span></td>
            <td>${problem.tags.join(', ')}</td>
            <td><a href="solution.html?id=${problem.id}">查看解题</a></td>
        `;
        
        problemTable.appendChild(row);
    });
}

// 设置题目筛选功能
function setupProblemFilters() {
    const problemSearch = document.getElementById('problem-search');
    const difficultyFilter = document.getElementById('difficulty-filter');
    const categoryFilter = document.getElementById('category-filter');
    
    if (problemSearch && difficultyFilter && categoryFilter) {
        const problemRows = document.querySelectorAll('.problem-table tbody tr');
        
        function filterProblems() {
            const searchTerm = problemSearch.value.toLowerCase();
            const difficultyValue = difficultyFilter.value;
            const categoryValue = categoryFilter.value;
            
            problemRows.forEach(row => {
                const title = row.querySelector('td:nth-child(2)').textContent.toLowerCase();
                const difficulty = row.querySelector('.difficulty').classList.contains(difficultyValue) || difficultyValue === 'all';
                const categories = row.querySelector('td:nth-child(4)').textContent.toLowerCase();
                const matchesCategory = categoryValue === 'all' || categories.includes(categoryValue);
                
                if (title.includes(searchTerm) && difficulty && matchesCategory) {
                    row.style.display = '';
                } else {
                    row.style.display = 'none';
                }
            });
        }
        
        problemSearch.addEventListener('input', filterProblems);
        difficultyFilter.addEventListener('change', filterProblems);
        categoryFilter.addEventListener('change', filterProblems);
    }
}

// 渲染题解页面
function renderProblemSolution(problem) {
    console.log('开始渲染题解:', problem.title);
    
    document.title = `${problem.title} - LeetCode题解博客`;
    
    // 修改选择器，使用更通用的方式查找主内容区域
    const mainContent = document.querySelector('main section');
    console.log('主内容区域:', mainContent);
    
    if (!mainContent) {
        console.error('未找到主内容区域，尝试其他选择器');
        // 尝试其他可能的选择器
        const alternativeContent = document.querySelector('main') || document.querySelector('body');
        if (alternativeContent) {
            console.log('使用替代内容区域');
            renderProblemContent(problem, alternativeContent);
            return;
        }
        console.error('无法找到任何可用的内容区域');
        return;
    }
    
    // 清空加载指示器
    mainContent.innerHTML = '';
    
    // 渲染内容
    renderProblemContent(problem, mainContent);
}

// 将渲染逻辑提取到单独的函数中
function renderProblemContent(problem, container) {
    // 创建题目信息区域
    const problemInfo = document.createElement('div');
    problemInfo.className = 'problem-info';
    
    problemInfo.innerHTML = `
        <span class="difficulty ${problem.difficulty}">${getDifficultyText(problem.difficulty)}</span>
        <h3>${problem.id}. ${problem.title}</h3>
        <p>${problem.content.description.replace(/\n/g, '</p><p>')}</p>
        
        ${problem.content.examples.map(example => `
            <h4>示例 ${problem.content.examples.indexOf(example) + 1}：</h4>
            <pre><code>输入：${example.input}
输出：${example.output}${example.explanation ? '\n解释：' + example.explanation : ''}</code></pre>
        `).join('')}
        
        <h4>提示：</h4>
        <ul>
            ${problem.content.constraints.map(constraint => `<li>${constraint}</li>`).join('')}
        </ul>
        
        <div class="tags">
            ${problem.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
        </div>
    `;
    
    // 创建解题内容区域
    const solutionContent = document.createElement('div');
    solutionContent.className = 'solution-content';
    
    solutionContent.innerHTML = `
        <h3>解题思路</h3>
        <p>${problem.content.solution.approach.replace(/\n/g, '</p><p>')}</p>
        
        <h3>代码实现</h3>
        
        ${problem.content.solution.code.java ? `
            <h4>Java 实现</h4>
            <div class="code-block">
                <pre><code class="language-java">${problem.content.solution.code.java}</code></pre>
            </div>
        ` : ''}
        
        ${problem.content.solution.code.python ? `
            <h4>Python 实现</h4>
            <div class="code-block">
                <pre><code class="language-python">${problem.content.solution.code.python}</code></pre>
            </div>
        ` : ''}
        
        ${problem.content.solution.code.javascript ? `
            <h4>JavaScript 实现</h4>
            <div class="code-block">
                <pre><code class="language-javascript">${problem.content.solution.code.javascript}</code></pre>
            </div>
        ` : ''}
        
        <h3>复杂度分析</h3>
        <div class="complexity">
            <div class="complexity-item">
                <strong>时间复杂度：</strong> ${problem.content.solution.timeComplexity}
            </div>
            <div class="complexity-item">
                <strong>空间复杂度：</strong> ${problem.content.solution.spaceComplexity}
            </div>
        </div>
        
        <div class="navigation-buttons">
            <a href="solution.html?id=${problem.id - 1}" class="prev-next-btn" ${problem.id <= 1 ? 'style="visibility: hidden;"' : ''}>上一题</a>
            <a href="solution.html?id=${problem.id + 1}" class="prev-next-btn">下一题</a>
        </div>
    `;
    
    // 添加到页面
    container.appendChild(problemInfo);
    container.appendChild(solutionContent);
    console.log('题解渲染完成');
    
    // 代码高亮
    if (typeof hljs !== 'undefined') {
        console.log('应用代码高亮');
        document.querySelectorAll('pre code').forEach(block => {
            hljs.highlightElement(block);
        });
    } else {
        console.warn('highlight.js未加载，无法应用代码高亮');
    }
}

// 显示错误信息
function showErrorMessage(message) {
    const mainContent = document.querySelector('main .container');
    if (!mainContent) return;
    
    const errorDiv = document.createElement('div');
    errorDiv.style.padding = '20px';
    errorDiv.style.backgroundColor = '#f8d7da';
    errorDiv.style.color = '#721c24';
    errorDiv.style.borderRadius = '8px';
    errorDiv.style.marginBottom = '20px';
    errorDiv.style.textAlign = 'center';
    
    errorDiv.innerHTML = `
        <h3>出错了</h3>
        <p>${message}</p>
        <a href="index.html" style="display: inline-block; margin-top: 10px;">返回首页</a>
    `;
    
    mainContent.prepend(errorDiv);
}

// 获取难度文本
function getDifficultyText(difficulty) {
    switch (difficulty) {
        case 'easy': return '简单';
        case 'medium': return '中等';
        case 'hard': return '困难';
        default: return '未知';
    }
}