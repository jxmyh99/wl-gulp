# Data

这个"data"支持'json'和'yaml'格式的文件，访问方式是'site.data'来访问

## Example

例如:

```
└── _data
    ├── global.yml
    └── menu.json
```

***global.yml***

```yml
siteName: Sample
```

***menu.json***

```json
[{
  "name": "Home"
},{
  "name": "About"
}]
```

他们将被转换为以下对象:

```js
{
  menu: [{
    name: "Home"
  }, {
    name: "About"
  }],
  global: {
    siteName: "Sample"
  }
}
```

然后将被注入到您的模板中:
下面以jade来演示
```jade
h1= site.data.global.siteName //- Sample
ul.menu
  each val in site.data.menu
    li= val.name //- Home, About
```
