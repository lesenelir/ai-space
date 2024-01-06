# AI-Space

- login
    - clerk login https://clerk.com/docs/quickstarts/nextjs

  
如果要新添加 model 类别：
- 在数据库中，手动添加新的类别，后期可以写一个脚本来为数据库自动注入模型的数据给 Model Table 中
- selectedModelIdAtom 初始值 必须 依赖于 modelsAtom 的第一个值 id


TODO：
- stop 的时候，捕获 TCP 错误，针对这个错误，将所生成的所有 token 存入数据库


增加 model 步骤：
- 数据库中 添加 新的 model
- 修改 `RenderModelIcon` 组件
- Select 组件中，修改 `models.map` 方法
- 修改 `utils/modelName` 方法
- 修改发送请求的部分

