# Modules

这个“模块”文件夹被指定为在布局和页面中使用的可重复使用的代码片段.

## Example


一个示例链接模块:

```
└── link
    ├── __tests__
    |   └── link.spec.js
    ├── link.jade
    ├── link.js
    └── link.scss
```

每个模块包括一个模板，JavaScript文件，样式表，和单元测试文件（如果做单元测试）.
这些文件应该使用相同的名称，即“链接”。如果你不需要在一个模块中的一个文件，就可以自由地删除它.

这将将您的新模块放在相应的原子文件夹中，如以下:

```
└── atoms
    └── link
        ├── __tests__
        |   └── link.spec.js
        ├── link.{jade,nunjucks}
        ├── link.js
        └── link.scss
```
