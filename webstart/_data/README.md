# 数据

这个'Data'的格式是以'json'格式化的文件，他的默认访问格式为'site.data'，但在jade里，已经改为'\_json'来访问即可使用'site.data'和'_json'都可以访问


## 目录

json存放的目录是在'webstart'目录下

```
└── _data
    └── menu.json
```

***menu.json***

```json
{
  "posts": [
    { "id": 1, "title": "json-server4", "author": "typicode" }
  ],
  "comments": [
    { "id": 1, "body": "some comment", "postId": 1 },
    { "id": 2, "body": "some comment2", "postId": 2 }
  ],
  "profile": { "name": "typicode" }
}
```

在jade中使用的例子如下：

```jade
h1= site.data.menu.posts.id //输出: 1
h1= _json.menu.posts[0].id //输出: 1
ul.menu
  each val in site.data.comments
    li= val.id //- Home, About
```

访问方法

_json(或者site.data)+文件名+你要的对象