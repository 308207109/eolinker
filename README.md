# eolinker

###### eolinker是一个基于php（5.3+，7.0+）的开源接口管理平台，开源版本定位于**个人以及微型团队**的文档管理以及开发协作，旨在帮助大家更好地管理接口文档，让专业的接口管理变简单。

######当前最新版本为2.1.7[2017年5月16日]，如需获取最新的更新动态以及功能介绍，请移步至：[eolinker介绍页面](https://www.eolinker.com/#/os/download "eolinker介绍页面")

---

**eolinker官网**：[eoLinker接口管理平台 | 业内领先的接口管理平台，让专业的接口管理变简单](https://www.eolinker.com "eoLinker接口管理平台 | 业内领先的接口管理平台，让专业的接口管理变简单")

**eolinker讨论QQ群**：284421832

**开源版本仅包含线上版本的基础功能**，如需使用更多功能，欢迎免费使用线上的版本。线上以及开源的数据是可以互相导入导出的。

eolinker开源版本仅供用户下载试用、学习和交流，**禁止“一切公开使用于商业用途”或者“以eolinker开源版本为基础而开发的二次版本”在互联网上流通。**

一经发现违反上条规则，我们将立刻启用法律程序进行维权。

希望我们能够共同维护国内的互联网开源文明和正常商业秩序。

---

##正常使用
详细图文指南请查看：**https://www.eolinker.com/#/os/guide?point=require#require**


##前端二次开发代码说明
######如果无需进行二次开发，则可以完全忽略以下内容！
---
#### 运行
首先进入要存放文件的文件夹路径

`git clone https://github.com/eolinker/frontend_resource`

`cd eolinker`

运行`npm install`安装运行依赖

运行`bower install`安装前端依赖

安装完毕后可运行

`gulp serve` --开发模式

`gulp build` --编译模式（将项目文件输出为上线文件）

`gulp serve:dist` --调试上线模式

#### Gulp

目录结构

--gulp

* --base.js    配置基本项目依赖
* --build.js   生成上线版本脚本
* --config.js  全局配置文件
* --server.js  代理服务器/服务器启动脚本

详细配置见文件注释

#### 框架目录

主要功能目录

* gulp 脚本管理
* src  项目源文件
* app.conf.json  Angular全部变量配置文件,通过[dev-config/prod-config任务编译]
* config.rb compass配置文件
* vendor.base.json 前端启动依赖文件(打包会随源文件一同压缩)
* vendor.json  前端依赖库文件(通过Lazyload模块加载)
* package.json 编译模块依赖文件以及项目配置--新增模块请注意加上 `npm install --save 新安装模块`
* bower.json 前端依赖库json文件 `bower install --save 新安装模块`

## 源文件

#### app目录

主要文件

* assets 存放静态文件
* config 全局配置文件,包括路由配置模块`routes`,全局定义模块`core`,以及按需加载模块`lazyload`
* directive 指令模块,页面所有的指令文件写在这里,模块位置为`eo-shop(项目名).directive`
* service 服务模块,页面所有的服务文件写在这里,模块位置为`eo-shop(项目名).service`
* filter 过滤器模块,页面所有的过滤器文件写在这里,模块位置为`eo-shop(项目名).filter`
* resource Api配置模块,全局的Api配置位置(目前Api数量较少,不考虑多文件,后期可能会改为多文件)
* app.module.js 全局模块依赖声明模块,如无需全局依赖更改,不要随意改动该文件内容.
* app.conf.js 由app.conf.json编译而来的全局变量文件,配置当前开发模式DEV/PRODUCTION
* vendor.js 前端依赖js库文件,随index.html注入文档
* vendor.scss 前端依赖scss库文件,通过在index.scss中引入
* index.scss 全局的样式文件.

