 ## 项目文件结构
ai-tools-navigator/
├── .env.local                 # 本地环境变量配置文件
├── .eslintrc.json             # ESLint 配置文件
├── .gitignore                 # Git 忽略文件配置
├── next.config.js            # Next.js 配置文件，包含图片域名和 Sentry 设置
├── package.json               # 项目依赖和脚本配置
├── postcss.config.js          # PostCSS 配置文件
├── README.md                  # 项目说明文档
├── tailwind.config.js         # Tailwind CSS 配置文件
├── tsconfig.json              # TypeScript 配置文件
├── public/                    # 静态资源目录
│   └── favicon.ico            # 网站图标
├── scripts/                   # 脚本目录
│   ├── importData.ts          # 数据导入脚本
│   ├── migrateToMongoDB.ts    # MongoDB 数据迁移脚本
│   ├── migrateReplies.ts      # 回复数据迁移脚本
│   └── updateAIToolsSchema.ts  # AITool 模型更新脚本
├── src/                       # 源代码目录
│   ├── app/                   # Next.js 13+ App Router 目录
│   │   ├── admin/             # 管理员相关页面
│   │   │   ├── tools/         # 工具相关 API
│   │   │   │   ├── [id]/     # 工具详情页面
│   │   │   │   │   └── comments/ # 评论相关 API
│   │   │   │   │   │   └── [commentId]/ # 评论详情页面
│   │   │   │   │   │   │   └── reply/ # 回复相关 API
│   │   │   │   │   │   │   │   └── [replyId]/ # 回复详情页面
│   │   │   │   │   │   │   │   │   └── route.ts # 处理评论回复的 API 路由
│   │   │   │   │   │   │   └── route.ts    # 处理评论回复的 API 路由
│   │   │   └── users/         # 用户相关 API
│   │   ├── login/             # 登录页面
│   │   ├── profile/           # 用户资料页面
│   │   ├── submit-tool/       # 提交工具页面
│   │   ├── tools/             # 工具详情页面
│   │   ├── global-error.js    # 全局错误处理
│   │   ├── layout.tsx         # 全局布局组件
│   │   ├── not-found.tsx      # 404 页面
│   │   └── page.tsx           # 首页
│   ├── components/            # React 组件目录
│   │   ├── AdminRoute.tsx     # 管理员路由保护组件
│   │   ├── AIToolCard.tsx     # AI 工具卡片组件
│   │   ├── AIToolListWrapper.tsx # AI 工具列表包装器
│   │   ├── AuthProvider.tsx   # 认证提供者组件
│   │   ├── CloudinaryCheck.tsx # Cloudinary 配置检查组件
│   │   ├── ErrorBoundary.tsx  # 错误边界组件
│   │   ├── ImageUpload.tsx    # 图片上传组件
│   │   ├── Layout.tsx         # 布局组件
│   │   ├── LoadingSpinner.tsx # 加载动画组件
│   │   ├── NavMenu.tsx        # 导航菜单组件
│   │   ├── ReplyForm.tsx      # 回复表单组件
│   │   ├── PasswordStrengthIndicator.tsx # 密码强度指示器
│   │   ├── EditProfileForm.tsx # 用户资料编辑表单组件
│   │   └── ...
│   ├── lib/                   # 库文件目录
│   │   └── dbConnect.ts       # 数据库连接函数
│   ├── middleware/            # 中间件目录
│   │   ├── errorHandler.ts    # 错误处理中间件
│   │   └── roleMiddleware.ts  # 角色中间件
│   ├── models/                # 数据模型目录
│   │   ├── AITool.ts          # AI 工具模型
│   │   ├── ErrorLog.ts        # 错误日志模型
│   │   └── User.ts            # 用户模型
│   ├── types/                 # 类型定义目录
│   │   ├── user.ts            # 用户相关类型定义
│   │   └── next.d.ts          # Next.js 类型扩展
│   └── utils/                 # 工具函数目录
│       ├── apiErrors.ts       # API 错误处理工具
│       ├── auth.ts            # 认证相关工具
│       ├── emailTemplates.ts  # 邮件模板
│       └── logger.ts          # 日志工具
└── stories/                   # Storybook 组件故事目录
 └── Button.stories.ts      # 按钮组件故事

## 文件结构说明

1. 根目录文件：包含项目配置、环境变量、依赖管理等基础设置。
2. public/：存放静态资源，如网站图标。
3. scripts/：包含数据导入和迁移脚本，用于初始化和维护数据。
4. src/：主要源代码目录。
   - app/：Next.js 13+ 的 App Router 结构，包含所有页面和 API 路由。
   - components/：可复用的 React 组件。
   - components/ReplyForm.tsx：新增的评论回复表单组件，用于用户提交回复。
- app/api/tools/[id]/comments/[commentId]/reply/[replyId]/route.ts：新增的 API 路由，处理评论回复的编辑和删除。
   - lib/：核心库文件，如数据库连接。
   - middleware/：中间件，用于请求处理和错误捕获。
   - models/：数据库模型定义。
   - types/：TypeScript 类型定义。
   - utils/：通用工具函数和辅助方法。
5. stories/：Storybook 组件故事，用于组件开发和测试。

这个文件结构反映了一个典型的 Next.js 项目，采用了模块化和关注点分离的原则。它将不同功能的代码分开存放，便于维护和扩展。在调试错误时，可以根据错误的性质快速定位到相关的文件或目录：

- 页面渲染问题：查看 src/app/ 下的相关页面文件
- API 错误：检查 src/app/api/ 下的相关路由
- 数据库问题：查看 src/models/ 和 src/lib/dbConnect.ts
- 组件问题：检查 src/components/ 目录
- 认证问题：查看 src/utils/auth.ts 和相关的 API 路由
- 全局错误：检查 src/app/global-error.js 和 src/middleware/errorHandler.ts

在进行错误排查时，可以先确定错误的类型（如前端渲染、API 请求、数据库操作等），然后根据这个文件结构快速定位到可能出问题的文件或模块。特别注意新的API路由结构和认证中间件的变化。