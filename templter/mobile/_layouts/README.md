# 布局

这个“布局”文件夹被指定为所有页面布局.

## 例子

例如:

```jade
extend ./base

// 添加 stylesheets
block append stylesheets

block content
  //- Provides layout level markup
  .layout-wrapper.two-col
    block first
        //- Add first column content here
    block second
        //- Add second column content here

// Add extra scripts
block append scripts
```

> 您可以阅读更多关于扩展 [Jade website](http://jade-lang.com/reference/)
