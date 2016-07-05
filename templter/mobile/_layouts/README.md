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

> NOTE: The `append stylesheets` and `append scripts` blocks allow you to add on any layout-specific scripts or stylesheets.
> The `content` block is overriding the parent `base.jade` file's block by the same name since we are extending from it.
> The `first` and `second` blocks can contain default markup, but also allow you to extend from this layout and overwrite them.
> You can read more about extensions and blocks on the [Jade website](http://jade-lang.com/reference/)

## Sub-generator

You can easily create new layouts using the built-in sub-generator like so:

```
yo yeogurt:layout two-col
```

### Extend from a layout other than `base`

You can also create a new layout that extends from a different layout file than `base.jade`.

```
yo yeogurt:layout three-col --layout=two-col
```

This new layout will look something like this:

```jade
extend ./two-col

// Add extra stylesheets
block append stylesheets

block content
  //- Provides layout level markup
  .layout-wrapper.three-col
    block three-col

// Add extra scripts
block append scripts
```
