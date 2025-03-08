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
        const response = await fetch('/data/problems.json');
        if (!response.ok) {
            throw new Error('无法加载题目数据');
        }
        const problems = await response.json();
        
        // 根据当前页面处理数据
        const currentPath = window.location.pathname;
        
        if (currentPath.endsWith('/index.html') || currentPath.endsWith('/')) {
            // 首页：显示精选题解
            renderFeaturedProblems(problems.slice(0, 3));
        } else if (currentPath.endsWith('/problems.html')) {
            // 题目列表页：显示所有题目
            renderProblemList(problems);
            setupProblemFilters();
        } else if (currentPath.includes('/solution.html')) {
            // 题解页：显示特定题目的解答
            const urlParams = new URLSearchParams(window.location.search);
            const problemId = urlParams.get('id');
            if (problemId) {
                const problem = problems.find(p => p.id === parseInt(problemId));
                if (problem) {
                    renderProblemSolution(problem);
                } else {
                    showErrorMessage('未找到该题目');
                }
            } else {
                showErrorMessage('未指定题目ID');
            }
        }
    } catch (error) {
        console.error('加载题目数据失败:', error);
        showErrorMessage('加载题目数据失败，请刷新页面重试');
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
    document.title = `${problem.title} - LeetCode题解博客`;
    
    const mainContent = document.querySelector('main .container section');
    if (!mainContent) return;
    
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
        
        <h4>Java 实现</h4>
        <div class="code-block">
            <pre><code class="language-java">${problem.content.solution.code.java}</code></pre>
        </div>
        
        <h4>Python 实现</h4>
        <div class="code-block">
            <pre><code class="language-python">${problem.content.solution.code.python}</code></pre>
        </div>
        
        <h4>JavaScript 实现</h4>
        <div class="code-block">
            <pre><code class="language-javascript">${problem.content.solution.code.javascript}</code></pre>
        </div>
        
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
            <a href="solution.html?id=${problem.id + 1}" class="prev-next-btn">下一题：${problem.id + 1}. 下一题</a>
        </div>
    `;
    
    mainContent.innerHTML = '';
    mainContent.appendChild(problemInfo);
    mainContent.appendChild(solutionContent);
    
    // 代码高亮
    if (typeof hljs !== 'undefined') {
        document.querySelectorAll('pre code').forEach(block => {
            hljs.highlightElement(block);
        });
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