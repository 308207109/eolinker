(function() {
    'use strict';

    angular.module('eolinker')
        /* 接口调用信息服务定义 */
        .factory('Api', Api)
        .constant('CODE', {
            SUCCESS: '000000',
            UNAUTH: '120005',
            EMPTY: '150008',
            CODEILLEGAL: '130003'
        })


    Api.$inject = ['$resource', 'serverUrl'];

    function Api($resource, serverUrl) {
        var API = {},
            method = 'POST';

        /*
         * 登陆检测/Web/Guest/checkLogin
         */
        API['Logintype'] = $resource(serverUrl + '?g=Web&c=Guest&o=checkLogin', {

            }, {
                Check: {
                    method: method
                }
            }

        );


        /*
         * 登录/Web/Guest/login
         * 退出登录/Web/User/logout
         */
        API['Login'] = $resource(serverUrl + '?g=Web&c=:name&o=:operate', {

            }, {
                Post: {
                    params: { name: 'Guest', operate: 'login' },
                    method: method
                },
                Out: {
                    params: { name: 'User', operate: 'logout' },
                    method: method
                }
            }

        );
        /*
         * 获取网站名称
         */
        API['WebName'] = $resource(serverUrl + '?g=Web&c=Index&o=:operate', {

            }, {
                Get: {
                    params: { operate:'getWebsiteName'},
                    method: method
                },
                Allow: {
                    params: { operate:'allowRegister'},
                    method: method
                }
            }
        );

        /*
         * 导入postman文件/Web/Import/ImportPostMan
         * 导入dhc文件/Web/Import/ImportDHC
         * 导入eoapi文件/Web/Import/ImportEoapi
         */
        API['Import'] = $resource(serverUrl + '?g=Web&c=Import&o=:operate', {

            }, {
                Postman: {
                    params: { operate: 'ImportPostMan' },
                    method: method
                },
                Dhc: {
                    params: { operate: 'ImportDHC' },
                    method: method
                },
                Eoapi: {
                    params: { operate: 'ImportEoapi' },
                    method: method
                }
            }

        );

        /*
         * 在线更新/Web/Update/autoUpdate
         * 手动更新/Web/Update/manualUpdate
         * 更新检测/Web/Update/checkUpdate
         */
        API['Update'] = $resource(serverUrl + '?g=Web&c=Update&o=:operate', {

            }, {
                autoUpdate: {
                    params: { operate: 'autoUpdate' },
                    method: method
                },
                manualUpdate: {
                    params: { operate: 'manualUpdate' },
                    method: method
                },
                Check: {
                    params: { operate: 'checkUpdate' },
                    method: method
                }
            }

        );

        /*
         * 注册/Web/Guest/register
         * 用户名重复检测/Web/Guest/checkUserNameExist
         */
        API['Register'] = $resource(serverUrl + '?g=Web&c=Guest&o=:operate', {

            }, {
                Name: {
                    params: { operate: 'register' },
                    method: method
                },
                Check: {
                    params: { operate: 'checkUserNameExist' },
                    method: method
                }
            }

        );

        /*
         * 安装/Web/Install/start
         * 环境检测/Web/Install/checkoutEnv
         * 检查是否安装/Web/Install/checkConfig 
         */
        API['Install'] = $resource(serverUrl + '?g=Web&c=Install&o=:operate', {

        }, {
            Post: {
                params: { operate: 'start' },
                method: method
            },
            Check: {
                params: { operate: 'checkoutEnv' },
                method: method
            },
            Config: {
                params: { operate: 'checkConfig' },
                method: method
            }
        });

        /*
         * 获取项目列表/Web/Project/getProjectList
         * 编辑项目/Web/Project/editProject
         * 新增项目/Web/Project/addProject
         * 删除项目/Web/Project/deleteProject
         * 获取项目详情/Web/Project/getProject
         * 导出项目/Web/Project/dumpProject
         * 获取api数量/Web/Project/getApiNum
         */
        API['Project'] = $resource(serverUrl + '?g=Web&c=Project&o=:operate', {

            }, {
                Query: {
                    params: { operate: 'getProjectList' },
                    method: method
                },
                Update: {
                    params: { operate: 'editProject' },
                    method: method
                },
                Add: {
                    params: { operate: 'addProject' },
                    method: method
                },
                Delete: {
                    params: { operate: 'deleteProject' },
                    method: method
                },
                Detail: {
                    params: { operate: 'getProject' },
                    method: method
                },
                Dump: {
                    params: { operate: 'dumpProject' },
                    method: method
                },
                Num: {
                    params: { operate: 'getApiNum' },
                    method: method
                }
            }

        );

        /*
         * 获取api列表/Web/Api/getApiList
         * 获取所有api列表/Web/Api/getAllApiList
         * 新增api/Web/Api/addApi
         * 删除api/Web/Api/removeApi
         * 编辑api/Web/Api/editApi
         * 搜索api/Web/Api/searchApi
         * 获取api详情/Web/Api/getApi
         */
        API['Api'] = $resource(serverUrl + '?g=Web&c=Api&o=:operate', {

            }, {
                Query: {
                    params: { operate: 'getApiList' },
                    method: method
                },
                All: {
                    params: { operate: 'getAllApiList' },
                    method: method
                },
                Add: {
                    params: { operate: 'addApi' },
                    method: method
                },
                Delete: {
                    params: { operate: 'removeApi' },
                    method: method
                },
                Update: {
                    params: { operate: 'editApi' },
                    method: method
                },
                Search: {
                    params: { operate: 'searchApi' },
                    method: method
                },
                Detail: {
                    params: { operate: 'getApi' },
                    method: method
                }
            }

        );

        /*
         * 获取数据库列表/Web/Database/getDatabase
         * 新增数据库/Web/Database/addDatabase
         * 编辑数据库/Web/Database/editDatabase
         * 删除数据库/Web/Database/deleteDatabase
         */
        API['Database'] = $resource(serverUrl + '?g=Web&c=Database&o=:operate', {

            }, {
                Query: {
                    params: { operate: 'getDatabase' },
                    method: method
                },
                Add: {
                    params: { operate: 'addDatabase' },
                    method: method
                },
                Update: {
                    params: { operate: 'editDatabase' },
                    method: method
                },
                Delete: {
                    params: { operate: 'deleteDatabase' },
                    method: method
                }
            }

        );

        /*
         * 获取回收站列表/Web/Api/getRecyclingStationApiList
         * 清空回收站/Web/Api/cleanRecyclingStation
         * 删除回收站中api/Web/Api/deleteApi
         * 恢复回收站中api/Web/Api/recoverApi
         */
        API['Trash'] = $resource(serverUrl + '?g=Web&c=Api&o=:operate', {

            }, {
                Query: {
                    params: { operate: 'getRecyclingStationApiList' },
                    method: method
                },
                Clean: {
                    params: { operate: 'cleanRecyclingStation' },
                    method: method
                },
                Delete: {
                    params: { operate: 'deleteApi' },
                    method: method
                },
                Recover: {
                    params: { operate: 'recoverApi' },
                    method: method
                }
            }

        );

        /*
         * 以get方法测试/Web/Test/get
         * 以post方法测试/Web/Test/post
         * 以delete方法测试/Web/Test/delete
         * 以patch方法测试/Web/Test/patch
         * 以head方法测试/Web/Test/head
         * 以options方法测试/Web/Test/options
         * 以put方法测试/Web/Test/put
         * 删除历史记录/Web/Test/deleteTestHistory
         */
        API['Test'] = $resource(serverUrl + '?g=Web&c=Test&o=:operate', {

            }, {
                Get: {
                    params: { operate: 'get' },
                    method: method
                },
                Post: {
                    params: { operate: 'post' },
                    method: method
                },
                Delete: {
                    params: { operate: 'delete' },
                    method: method
                },
                Patch: {
                    params: { operate: 'patch' },
                    method: method
                },
                Head: {
                    params: { operate: 'head' },
                    method: method
                },
                Options: {
                    params: { operate: 'options' },
                    method: method
                },
                Put: {
                    params: { operate: 'put' },
                    method: method
                },
                DeleteHistory: {
                    params: { operate: 'deleteTestHistory' },
                    method: method
                }
            }

        );

        /*
         * 增加星标/Web/Api/addStar
         * 移除星标/Web/Api/removeStar
         */
        API['Star'] = $resource(serverUrl + '?g=Web&c=Api&o=:operate', {

            }, {
                Add: {
                    params: { operate: 'addStar' },
                    method: method
                },
                Delete: {
                    params: { operate: 'removeStar' },
                    method: method
                }
            }

        );

        /*
         * 获取状态码列表/Web/StatusCode/getCodeList
         * 获取所有状态码列表/Web/StatusCode/getAllCodeList
         * 新增状态码/Web/StatusCode/addCode
         * 删除状态码/Web/StatusCode/deleteCode
         * 编辑状态码/Web/StatusCode/editCode
         * 搜索状态码/Web/StatusCode/searchStatusCode
         * 获取所有状态码/Web/StatusCode/getStatusCodeNum
         */
        API['Code'] = $resource(serverUrl + '?g=Web&c=StatusCode&o=:operate', {

            }, {
                Query: {
                    params: { operate: 'getCodeList' },
                    method: method
                },
                All: {
                    params: { operate: 'getAllCodeList' },
                    method: method
                },
                Add: {
                    params: { operate: 'addCode' },
                    method: method
                },
                Delete: {
                    params: { operate: 'deleteCode' },
                    method: method
                },
                Update: {
                    params: { operate: 'editCode' },
                    method: method
                },
                Search: {
                    params: { operate: 'searchStatusCode' },
                    method: method
                },
                Num: {
                    params: { operate: 'getStatusCodeNum' },
                    method: method
                }
            }

        );

        /*
         * 获取环境列表/Web/Project/getEnvList
         * 新增环境/Web/Project/addEnv
         * 删除环境/Web/Project/deleteEnv
         * 编辑环境/Web/Project/editEnv
         */
        API['Env'] = $resource(serverUrl + '?g=Web&c=Project&o=:operate', {

            }, {
                Query: {
                    params: { operate: 'getEnvList' },
                    method: method
                },
                Add: {
                    params: { operate: 'addEnv' },
                    method: method
                },
                Delete: {
                    params: { operate: 'deleteEnv' },
                    method: method
                },
                Edit: {
                    params: { operate: 'editEnv' },
                    method: method
                }
            }

        );

        /*
         * 获取协作成员列表/Web/Partner/getEnvList
         * 新增协作成员/Web/Partner/invitePartner
         * 删除协作成员/Web/Partner/removePartner
         * 退出协作/Web/Partner/quitPartner
         * 搜索协作成员/Web/Partner/getPartnerInfo
         */
        API['Partner'] = $resource(serverUrl + '?g=Web&c=Partner&o=:operate', {

            }, {
                Query: {
                    params: { operate: 'getPartnerList' },
                    method: method
                },
                Add: {
                    params: { operate: 'invitePartner' },
                    method: method
                },
                Delete: {
                    params: { operate: 'removePartner' },
                    method: method
                },
                Quit: {
                    params: { operate: 'quitPartner' },
                    method: method
                },
                Search: {
                    params: { operate: 'getPartnerInfo' },
                    method: method
                }
            }

        );

        /*
         * 获取分组列表/Web/Group/getGroupList
         * 新增分组/Web/Group/addGroup
         * 删除分组/Web/Group/deleteGroup
         * 编辑分组/Web/Group/editGroup
         */
        API['Group'] = $resource(serverUrl + '?g=Web&c=Group&o=:operate', {

            }, {
                Query: {
                    params: { operate: 'getGroupList' },
                    method: method
                },
                Add: {
                    params: { operate: 'addGroup' },
                    method: method
                },
                Delete: {
                    params: { operate: 'deleteGroup' },
                    method: method
                },
                Update: {
                    params: { operate: 'editGroup' },
                    method: method
                }
            }

        );

        /*
         * 获取状态码分组列表/Web/StatusCodeGroup/getGroupList
         * 新增状态码分组/Web/StatusCodeGroup/addGroup
         * 删除状态码分组/Web/StatusCodeGroup/deleteGroup
         * 编辑状态码分组/Web/StatusCodeGroup/editGroup
         */
        API['CodeGroup'] = $resource(serverUrl + '?g=Web&c=StatusCodeGroup&o=:operate', {

            }, {
                Query: {
                    params: { operate: 'getGroupList' },
                    method: method
                },
                Add: {
                    params: { operate: 'addGroup' },
                    method: method
                },
                Delete: {
                    params: { operate: 'deleteGroup' },
                    method: method
                },
                Update: {
                    params: { operate: 'editGroup' },
                    method: method
                }
            }

        );

        /*
         * 修改用户密码/Web/User/changePassword
         * 修改用户昵称/Web/User/changeNickName
         * 获取用户信息/Web/User/getUserInfo
         */
        API['User'] = $resource(serverUrl + '?g=Web&c=User&o=:operate', {

            }, {
                Password: {
                    params: { operate: 'changePassword' },
                    method: method
                },
                Nickname: {
                    params: { operate: 'changeNickName' },
                    method: method
                },
                Info: {
                    params: { operate: 'getUserInfo' },
                    method: method
                }
            }

        );

        /*
         * 获取消息列表/Web/Message/getMessageList
         * 清空消息/Web/Message/cleanMessage
         * 读取消息/Web/Message/readMessage
         * 删除消息/Web/Message/delMessage
         * 获取未读消息数量/Web/Message/getUnreadMessageNum
         */
        API['News'] = $resource(serverUrl + '?g=Web&c=Message&o=:operate', {

            }, {
                Query: {
                    params: { operate: 'getMessageList' },
                    method: method
                },
                Clean: {
                    params: { operate: 'cleanMessage' },
                    method: method
                },
                Read: {
                    params: { operate: 'readMessage' },
                    method: method
                },
                Delete: {
                    params: { operate: 'delMessage' },
                    method: method
                },
                UnReadNum: {
                    params: { operate: 'getUnreadMessageNum' },
                    method: method
                }
            }

        );

        /*
         * 获取表列表/Web/DatabaseTable/getTableList
         * 新增表/Web/DatabaseTable/addTable
         * 编辑表/Web/DatabaseTable/editTable
         * 删除表/Web/DatabaseTable/deleteTable
         */
        API['Table'] = $resource(serverUrl + '?g=Web&c=DatabaseTable&o=:operate', {

            }, {
                Query: {
                    params: { operate: 'getTable' },
                    method: method
                },
                Add: {
                    params: { operate: 'addTable' },
                    method: method
                },
                Update: {
                    params: { operate: 'editTable' },
                    method: method
                },
                Delete: {
                    params: { operate: 'deleteTable' },
                    method: method
                }
            }

        );

        /*
         * 获取字段列表/Web/DatabaseTableField/getFieldList
         * 新增字段/Web/DatabaseTableField/addField
         * 编辑字段/Web/DatabaseTableField/editField
         * 删除字段/Web/DatabaseTableField/deleteField
         */
        API['Field'] = $resource(serverUrl + '?g=Web&c=DatabaseTableField&o=:operate', {

            }, {
                Query: {
                    params: { operate: 'getField' },
                    method: method
                },
                Add: {
                    params: { operate: 'addField' },
                    method: method
                },
                Update: {
                    params: { operate: 'editField' },
                    method: method
                },
                Delete: {
                    params: { operate: 'deleteField' },
                    method: method
                }
            }

        );

        return API;
    }
})();
