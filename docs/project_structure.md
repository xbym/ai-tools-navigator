 ## 项目文件结构
ai-tools-navigator/
├── .env.local                 # 本地环境变量配置文件
├── .eslintrc.json             # ESLint 配置文件
├── .gitignore                 # Git 忽略文件配置
├── next.config.js             # Next.js 配置文件
├── package.json               # 项目依赖和脚本配置
├── postcss.config.js          # PostCSS 配置文件
├── README.md                  # 项目说明文档
├── tailwind.config.js         # Tailwind CSS 配置文件
├── tsconfig.json              # TypeScript 配置文件
├── tsconfig.server.json       # 服务器端 TypeScript 配置
├── jest.config.js             # Jest 测试配置
├── jest.setup.js              # Jest 测试设置
├── next-sitemap.config.js     # 网站地图配置
├── sentry.client.config.js    # Sentry 客户端配置
├── public/                    # 静态资源目录
│   └── favicon.ico            # 网站图标
├── pages/                     # Next.js Pages 目录（用于旧版路由）
│   ├── api/                   # API 路由（旧版）
│   └── _app.tsx               # 自定义 App 组件
├── components/                # 根目录下的 React 组件
│   ├── Layout.tsx             # 全局布局组件
│   └── Navbar.tsx             # 导航栏组件
├── lib/                       # 根目录下的库文件
│   └── mongodb.ts             # MongoDB 连接工具
├── types/                     # 根目录下的类型定义
│   └── index.ts               # 全局类型定义
├── scripts/                   # 脚本目录
│   ├── checkComments.ts       # 检查评论脚本
│   ├── importData.ts          # 数据导入脚本
│   ├── migrateToMongoDB.ts    # MongoDB 数据迁移脚本
│   ├── updateAIToolsSchema.ts # AITool 模型更新脚本
│   ├── updateComments.ts      # 更新评论脚本
│   └── updateCommentsWithReplies.ts # 更新评论和回复脚本
├── src/                       # 源代码目录
│   ├── app/                   # Next.js 13+ App Router 目录
│   │   ├── admin/             # 管理员相关页面
│   │   │   ├── add-tool/      # 添加工具页面
│   │   │   ├── edit-tool/     # 编辑工具页面
│   │   │   ├── notifications/ # 通知管理页面
│   │   │   └── tools/         # 工具管理页面
│   │   ├── login/             # 登录页面
│   │   ├── profile/           # 用户资料页面
│   │   ├── submit-tool/       # 提交工具页面
│   │   ├── tools/             # 工具详情页面
│   │   ├── api/               # API 路由
│   │   │   ├── admin/         # 管理员 API
│   │   │   ├── tools/         # 工具相关 API
│   │   │   └── users/         # 用户相关 API
│   │   ├── global-error.tsx   # 全局错误处理
│   │   ├── layout.tsx         # 全局布局组件
│   │   ├── not-found.tsx      # 404 页面
│   │   └── page.tsx           # 首页
│   ├── components/            # React 组件目录
│   │   ├── AdminRoute.tsx     # 管理员路由保护组件
│   │   ├── AIToolCard.tsx     # AI 工具卡片组件
│   │   ├── AIToolList.tsx     # AI 工具列表组件
│   │   ├── AIToolListWrapper.tsx # AI 工具列表包装器
│   │   ├── AuthProvider.tsx   # 认证提供者组件
│   │   ├── CloudinaryCheck.tsx # Cloudinary 配置检查组件
│   │   ├── CommentForm.tsx    # 评论表单组件
│   │   ├── CommentList.tsx    # 评论列表组件
│   │   ├── CommentSection.tsx # 评论区组件
│   │   ├── EditCommentForm.tsx # 编辑评论表单组件
│   │   ├── EditProfileForm.tsx # 用户资料编辑表单组件
│   │   ├── ErrorBoundary.tsx  # 错误边界组件
│   │   ├── ImageUpload.tsx    # 图片上传组件
│   │   ├── Layout.tsx         # 布局组件
│   │   ├── LoadingSpinner.tsx # 加载动画组件
│   │   ├── NavMenu.tsx        # 导航菜单组件
│   │   ├── PasswordStrengthIndicator.tsx # 密码强度指示器
│   │   ├── ReplyForm.tsx      # 回复表单组件
│   │   └── ToolDetailContent.tsx # 工具详情内容组件
│   ├── hooks/                 # 自定义 Hooks 目录
│   │   ├── useAuth.ts         # 认证相关 Hook
│   │   ├── useCommentActions.ts # 评论操作 Hook
│   │   ├── useCommentForm.ts  # 评论表单 Hook
│   │   ├── useComments.ts     # 评论管理 Hook
│   │   ├── useReaction.ts     # 反应操作 Hook
│   │   ├── useReport.ts       # 举报操作 Hook
│   │   └── useReply.ts        # 回复操作 Hook
│   ├── lib/                   # 库文件目录
│   │   ├── dbConnect.ts       # 数据库连接函数
│   │   └── emailTemplates.ts  # 邮件模板
│   ├── middleware/            # 中间件目录
│   │   ├── authMiddleware.ts  # 认证中间件
│   │   ├── errorHandler.ts    # 错误处理中间件
│   │   └── roleMiddleware.ts  # 角色中间件
│   ├── models/                # 数据模型目录
│   │   ├── AITool.ts          # AI 工具模型
│   │   ├── ErrorLog.ts        # 错误日志模型
│   │   ├── Notification.ts    # 通知模型
│   │   └── User.ts            # 用户模型
│   ├── types/                 # 类型定义目录
│   │   ├── AITool.ts          # AI 工具类型定义
│   │   ├── next.d.ts          # Next.js 类型扩展
│   │   └── user.ts            # 用户相关类型定义
│   └── utils/                 # 工具函数目录
│       ├── api.ts             # API 请求工具
│       ├── apiErrors.ts       # API 错误处理工具
│       ├── auth.ts            # 认证相关工具
│       └── logger.ts          # 日志工具
├── data/                      # 数据目录
│   └── ai-tools.json          # AI 工具数据文件
└── docs/                      # 文档目录
    ├── issues_and_next_steps.md # 问题和下一步计划
    ├── long_term_goals.md     # 长期目标
    ├── notes.md               # 注意事项
    ├── project_status.md      # 项目状态
    ├── project_status_2.md    # 项目状态续
    ├── project_status_3.md    # 项目状态续2
    ├── project_structure.md   # 项目结构文档
    └── technical_debt.md      # 技术债务文档
文件结构说明（更新）
1.根目录文件：除了之前提到的文件外，还包括了一些配置文件。
2.pages/：这是 Next.js 的传统页面路由目录，用于兼容旧版路由系统。它包含了 API 路由和自定义 App 组件。
3.components/：根目录下的组件文件夹，通常包含全局使用的组件，如 Layout 和 Navbar。
4.lib/：根目录下的库文件夹，包含了一些全局使用的工具，如 MongoDB 连接工具。
5.types/：根目录下的类型定义文件夹，包含全局使用的类型定义。
6.src/：主要源代码目录，结构与之前描述的相同。
这个更新后的结构反映了一个混合使用 Next.js 页面路由和 App Router 的项目。它保留了一些旧的结构（如根目录下的 pages、components、lib 和 types 文件夹），同时也采用了新的 App Router 结构（src/app 目录）。
在进行错误排查时，除了之前提到的方法，还需要注意：
检查根目录下的 pages 文件夹中的路由和 API
查看根目录下的 components 文件夹中的全局组件
检查根目录下的 lib 文件夹中的全局工具函数
查看根目录下的 types 文件夹中的全局类型定义
这种混合结构可能是为了逐步迁移到 App Router 或者保持对旧版本的兼容性。在未来的重构中，可能会考虑将所有内容统一到 src 目录下，以保持更好的一致性。