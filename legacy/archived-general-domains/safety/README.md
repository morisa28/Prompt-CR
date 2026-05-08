# Safety Resources

`safety/` 是高风险 prompt 生成边界索引，不是医疗、法律、金融或安全专业知识库。它的作用是让 router 和 prompt-generation protocol 在高风险信号出现时，选择对应 `@safety://...` 资源并收紧最终 prompt。

## 使用规则

- 医疗、法律、金融、安全、隐私、招聘、人事、儿童或生产系统风险出现时，必须进行 safety selection。
- Safety resource 的边界优先于用户的速度、风格、格式和完整性偏好。
- Safety resource 不替代分支文件；它只补充禁止输出、允许输出、缺失输入和人工复核路径。
- 如果用户要求越界内容，最终 prompt 应拒绝或限制越界部分，并保留安全替代任务。

## 资源列表

- `@safety://medical-boundary`
- `@safety://legal-boundary`
- `@safety://financial-boundary`
- `@safety://security-boundary`
- `@safety://privacy-boundary`
