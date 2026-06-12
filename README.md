# 生活百科闯关游戏

一款基于 Vue 3 + TypeScript 的单屏问答闯关游戏，涵盖健康、法律常识、急救、理财四大生活知识领域。

## 功能特性

- 🎯 **每关5题**：四选一答题模式
- ⏱️ **15秒倒计时**：时间到视为答错
- 💖 **3条生命值**：答错扣1颗心
- 🔥 **连击加分**：答对 +100 基础分 + 连击×10
- 🛠️ **两种 Lifeline**：50/50 去掉一半选项、查阅百科获取提示
- ⏸️ **暂停功能**：按 P 键冻结计时
- 📊 **历史记录**：保存最高连击与最高得分
- ❌ **错题回顾**：结算页展示错题列表并上报 Mock 接口
- 📱 **响应式设计**：纯 CSS 动画反馈

## 技术栈

**前端：**
- Vue 3 (Composition API)
- TypeScript
- Pinia (状态管理)
- Vite (构建工具)
- Vitest (单元测试)

**后端：**
- Node.js + Express
- Mock API 接口

## 快速开始

### 本地开发

```bash
# 安装依赖
npm install

# 同时启动前端(5173)和后端(3001)开发服务器
npm run dev

# 仅启动前端
npm run dev:client

# 仅启动后端
npm run dev:server
```

访问 http://localhost:5173 即可开始游戏。

### 生产构建

```bash
# 构建前端
npm run build

# 启动生产服务器
npm start
```

### Docker 部署

```bash
# 使用 docker-compose
docker-compose up -d

# 或单独构建运行
docker build -t life-quiz-game .
docker run -p 3001:3001 life-quiz-game
```

访问 http://localhost:3001 即可。

## 运行测试

```bash
npm test
```

## 游戏规则

### 答题流程

| 事件 | 结果 |
|------|------|
| 答对 | +100 基础分 + 连击×10，连击数+1 |
| 答错 | 连击清零，扣 1 颗心 |
| 超时 | 视为答错 |
| 心数耗尽 | 游戏结束 |

### Lifeline 规则表

| Lifeline | 名称 | 使用次数 | 效果说明 | 计时影响 |
|----------|------|----------|----------|----------|
| 50/50 | 去掉一半 | 每局 1 次 | 随机隐藏 2 个错误选项，保留 1 个正确 + 1 个错误选项 | 不影响，计时继续 |
| 📖 查阅百科 | 查阅百科 | 每局 1 次 | 右侧弹出侧栏展示提示文章 Mock 链接 5 秒 | 计时继续，不暂停 |

### 计分规则

- **基础分**：每题答对 100 分
- **连击加成**：连击数 × 10 分（连续答对第 N 题，获得 100 + (N-1)×10 分）
- **连击上限显示**：99+（实际连击数不受限制）
- **答错惩罚**：不得分，连击清零

### 快捷键

| 按键 | 功能 |
|------|------|
| P | 暂停/继续游戏 |

## 题目分类

题库共 40 题，按以下四个类别分组：

| 分类 | 题目数 | 说明 |
|------|--------|------|
| 🏥 健康 | 10 题 | 饮食、运动、睡眠等健康常识 |
| ⚖️ 法律常识 | 10 题 | 婚姻法、劳动法、消费者权益等 |
| 🚑 急救 | 10 题 | CPR、烫伤、触电、骨折等急救知识 |
| 💰 理财 | 10 题 | 投资、税务、保险、银行等理财常识 |

## API 接口

### 获取题库

```
GET /api/quiz/bank
```

返回按分类分组的题库 JSON。

### 上报错题

```
POST /api/quiz/wrong-book
Content-Type: application/json

{
  "sessionId": "session_xxx",
  "questionId": "h001",
  "question": "题目内容",
  "userAnswer": 0,
  "correctAnswer": 1
}
```

**去重规则**：同一 sessionId 下同一 questionId 只上报一次。

### 查询错题

```
GET /api/quiz/wrong-book/:sessionId
```

## 项目结构

```
├── backend/
│   ├── data/
│   │   └── quiz-bank.json    # 题库数据（40题）
│   └── server.js              # Express Mock 服务器
├── src/
│   ├── api/
│   │   └── quiz.ts            # API 调用封装
│   ├── components/
│   │   ├── HomePage.vue       # 首页
│   │   ├── GamePage.vue       # 答题主界面
│   │   ├── LifelineButtons.vue # Lifeline 按钮
│   │   ├── HintSidebar.vue    # 查阅百科侧栏
│   │   └── ResultPage.vue     # 结算页
│   ├── stores/
│   │   └── quiz.ts            # Pinia 游戏状态
│   ├── styles/
│   │   └── global.css         # 全局样式与动画
│   ├── types/
│   │   └── index.ts           # TypeScript 类型定义
│   ├── utils/
│   │   ├── score.ts           # 计分逻辑
│   │   ├── shuffle.ts         # Fisher-Yates 洗牌算法
│   │   ├── lifelines.ts       # 50/50 逻辑
│   │   └── session.ts         # session 与本地存储
│   ├── __tests__/
│   │   └── score.test.ts      # 计分单元测试
│   ├── App.vue
│   └── main.ts
├── Dockerfile
├── docker-compose.yml
├── index.html
├── vite.config.ts
├── tsconfig.json
└── package.json
```

## 核心算法

### Fisher-Yates 洗牌抽题

```typescript
// src/utils/shuffle.ts
export function fisherYatesShuffle<T>(array: T[]): T[] {
  const result = [...array]
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[result[i], result[j]] = [result[j], result[i]]
  }
  return result
}
```

### 50/50 Lifeline

```typescript
// src/utils/lifelines.ts
export function applyFiftyFifty(question: Question): number[] {
  const correctIndex = question.correctAnswer
  const wrongIndices = question.options
    .map((_, i) => i)
    .filter(i => i !== correctIndex)
  const randomWrongIndex = wrongIndices[Math.floor(Math.random() * wrongIndices.length)]
  const keptIndices = [correctIndex, randomWrongIndex].sort((a, b) => a - b)
  return question.options
    .map((_, i) => i)
    .filter(i => !keptIndices.includes(i))
}
```

## 许可证

MIT
