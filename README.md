# LeetCode题解博客

这是一个专注于分享LeetCode题目解析的个人博客网站。通过这个博客，你可以学习各种算法和数据结构的应用，提高解决问题的能力。

## 项目结构

```
├── index.html              # 博客首页
├── problems.html           # 题目列表页面
├── about.html              # 关于页面
├── solution.html           # 通用题解页面（动态加载内容）
├── styles.css              # 全局样式文件
├── script.js               # JavaScript交互功能
├── data/                   # 数据文件夹
│   └── problems.json       # 题目数据JSON文件
├── admin/                  # 管理功能
│   └── add-solution.html   # 添加新题解页面
└── README.md               # 项目说明文件
```

## 功能特点

- 响应式设计，适配各种设备
- 题目分类和难度筛选
- 详细的解题思路和代码实现
- 代码高亮显示
- 时间复杂度和空间复杂度分析
- **动态添加题解**功能，无需手动编写HTML

## 本地运行

由于这是一个纯静态网站，你可以直接在浏览器中打开`index.html`文件来访问博客。

或者使用简单的HTTP服务器来运行（推荐，因为需要加载JSON数据）：

```bash
# 如果你安装了Python
python -m http.server

# 如果你安装了Node.js
npx serve
```

然后在浏览器中访问`http://localhost:8000`或`http://localhost:5000`。

## 添加新题解

### 方法一：使用网页表单（推荐）

1. 在首页点击"添加新题解"按钮
2. 填写题目的基本信息、题目描述和解题思路
3. 预览题解内容并提交
4. 下载生成的JSON文件
5. 将JSON文件内容添加到`data/problems.json`文件中

### 方法二：直接编辑JSON文件

1. 打开`data/problems.json`文件
2. 按照现有格式添加新的题目数据
3. 保存文件

JSON数据格式示例：

```json
{
  "id": 1,
  "title": "两数之和",
  "titleEn": "Two Sum",
  "difficulty": "easy",
  "tags": ["数组", "哈希表"],
  "url": "https://leetcode.cn/problems/two-sum/",
  "content": {
    "description": "题目描述...",
    "examples": [
      {
        "input": "nums = [2,7,11,15], target = 9",
        "output": "[0,1]",
        "explanation": "因为 nums[0] + nums[1] == 9 ，返回 [0, 1] 。"
      }
    ],
    "constraints": ["约束条件1", "约束条件2"],
    "solution": {
      "approach": "解题思路...",
      "timeComplexity": "O(n)",
      "spaceComplexity": "O(n)",
      "code": {
        "java": "Java代码...",
        "python": "Python代码...",
        "javascript": "JavaScript代码..."
      }
    }
  }
}
```

## 技术实现

本项目使用纯前端技术实现，主要包括：

- HTML5 + CSS3：构建页面结构和样式
- JavaScript：实现动态加载内容和交互功能
- JSON：存储题目数据
- highlight.js：代码语法高亮

由于是纯静态网站，添加的题解数据会保存在本地存储或JSON文件中。如果需要多人协作或在线保存数据，可以考虑添加后端服务。

## 贡献

欢迎提交Pull Request来改进这个博客或添加新的题解。如果你发现任何问题，也可以提交Issue。

## 许可证

本项目采用MIT许可证。详情请参阅LICENSE文件。



