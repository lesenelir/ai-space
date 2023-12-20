# AI-Space

- login
    - clerk login https://clerk.com/docs/quickstarts/nextjs

  
如果要新添加 model 类别：
- 在数据库中，手动添加新的类别，后期可以写一个脚本来为数据库自动注入模型的数据给 Model Table 中
- selectedModelIdAtom 初始值 必须 依赖于 modelsAtom 的第一个值 id

