(function() {

    angular.module('eolinker')

    .controller('InfoModelCtrl', InfoModelCtrl)

    .controller('TipsModelCtrl', TipsModelCtrl)

    .controller('MessageModelCtrl', MessageModelCtrl)

    .controller('ErrorModelCtrl', ErrorModelCtrl)

    .controller('ImportModelCtrl', ImportModelCtrl)

    .controller('EnsureModelCtrl', EnsureModelCtrl)

    .controller('UpdateModelCtrl', UpdateModelCtrl)

    .controller('TeamModelCtrl', TeamModelCtrl)

    .controller('EnVModelCtrl', EnVModelCtrl)

    .controller('FieldModelCtrl', FieldModelCtrl)

    .controller('ProjectModelCtrl', ProjectModelCtrl)

    .controller('DatabaseModelCtrl', DatabaseModelCtrl)

    .controller('GroupModelCtrl', GroupModelCtrl)

    .controller('TableModelCtrl', TableModelCtrl)

    .controller('CodeModelCtrl', CodeModelCtrl)

    .controller('JsonToParamInputModelCtrl', JsonToParamInputModelCtrl)

    // 消息提示弹窗控制器
    InfoModelCtrl.$inject = ['$scope', '$uibModalInstance', '$timeout', 'info', 'type'];

    function InfoModelCtrl($scope, $uibModalInstance, $timeout, info, type) {

        $scope.type = type ? type : 'info';
        $scope.info = info;
        $timeout(function() {
            // $uibModalInstance.dismiss(false);
            $uibModalInstance.close(true);
        }, 1500, true)
    }

    // tips弹窗控制器
    TipsModelCtrl.$inject = ['$scope', '$uibModalInstance', '$timeout', '$sce'];

    function TipsModelCtrl($scope, $uibModalInstance, $timeout, $sce) {

        $scope.tips = {
            img: '',
            text: '',
            num: 0
        }
        var imgQuery = [
            'app/assets/images/tips-1.jpg',
            'app/assets/images/tips-2.jpg',
            'app/assets/images/tips-3.jpg',
            'app/assets/images/tips-4.jpg',
            'app/assets/images/tips-5.jpg',
            'app/assets/images/tips-6.jpg'
        ];
        var textQuery = [
            '<p class="first-p">您可以在接口列表界面了解接口的请求方式</p>',
            '<p class="first-p">您可以根据圆点的颜色来判断当前接口状态：</p><p class="second-p"><span class="eo-status-success">绿色</span>启用、<span class="eo-status-warning">黄色</span>维护、<span class="eo-status-default">灰色</span>弃用</p>',
            '<p class="first-p">星标表示需要重点关注的接口</p><p class="second-p">你可以使用它来标注/找出需要重点维护的接口</p>',
            '<p class="first-p">您可以通过文档的测试模块来进行远程的跨域请求</p><p class="second-p">eolinker将会给你提供完整的测试结果</p>',
            '<p class="first-p">如需新建类似的接口，您只需在接口详情点击 <span class="bold-span">[更多-另存为]</span></p>',
            '<p class="first-p">eolinker为您提供mock请求地址，即使后台尚未完成开发</p><p class="second-p"> 前端依然可以通过mock请求地址得到理想的结果</p>'
        ]

        var init = function() { // 初始化tips信息
            $scope.tips.text = $sce.trustAsHtml(textQuery[0]);
            $scope.tips.img = imgQuery[0];
        }
        init();

        $scope.imgNext = function(val) { // 下一页
            if (val == 5) val = -1;
            $scope.next(++val);
        }

        $scope.next = function(val) { // 跳转至指定页面
            $scope.tips.text = $sce.trustAsHtml(textQuery[val]);
            $scope.tips.img = imgQuery[val];
            $scope.tips.num = val;
        }
        $scope.cancel = function() {
            // $uibModalInstance.dismiss(false);
            $uibModalInstance.close(false);
        };
    }


    // 信息弹窗控制器
    MessageModelCtrl.$inject = ['$scope', '$uibModalInstance', '$timeout', 'title', 'info'];

    function MessageModelCtrl($scope, $uibModalInstance, $timeout, title, info) {
        $scope.title = title;
        $scope.info = info;
        $scope.cancel = function() {
            // $uibModalInstance.dismiss(false);
            $uibModalInstance.close(false);
        };
    }

    // 错误弹窗控制器
    ErrorModelCtrl.$inject = ['$scope', '$uibModalInstance', '$timeout', 'title', 'info'];

    function ErrorModelCtrl($scope, $uibModalInstance, $timeout, title, info) {
        $scope.title = title;
        $scope.info = info;
        $scope.cancel = function() {
            // $uibModalInstance.dismiss(false);
            $uibModalInstance.close(false);
        };
    }

    // 导入弹窗控制器
    ImportModelCtrl.$inject = ['$scope', '$uibModalInstance', '$timeout', 'title', 'Api', 'CODE', '$uibModal'];

    function ImportModelCtrl($scope, $uibModalInstance, $timeout, title, Api, CODE, $uibModal) {
        var code = CODE.SUCCESS;
        $scope.title = title;
        $scope.loadingIsEnd = true;
        $scope.importFile = function(info, $file) {
            var file = $file[0];

            // 导入文件只能为json,txt和export中的一种
            if (file.name.indexOf('json') > -1 || file.name.indexOf('txt') > -1 || file.name.indexOf('export') > -1) {
                var reader = new FileReader();
                reader.readAsText(file);
                $scope.loadingIsEnd = false;
                reader.onload = function(evt) {
                    switch (info) {
                        case 0:
                            // 导入eolinker
                            {
                                Api.Import.Eoapi({ data: this.result }).$promise.then(function(data) {
                                    $scope.loadingIsEnd = true;
                                    switch (data.statusCode) {
                                        case code:
                                            {
                                                $uibModalInstance.close(true);
                                                break;
                                            }
                                        case '310004':
                                            {
                                                $scope.InfoModel('数据格式错误', 'error');
                                                break;
                                            }
                                        default:
                                            {
                                                $scope.InfoModel('导入失败', 'error');
                                                break;
                                            }
                                    }
                                });
                                break;
                            }
                        case 1:
                            // 导入postman v1
                        case 2:
                            // 导入postman v2
                            {
                                Api.Import.Postman({ data: this.result, version: info }).$promise.then(function(data) {
                                    $scope.loadingIsEnd = true;
                                    switch (data.statusCode) {
                                        case code:
                                            {
                                                $uibModalInstance.close(true);
                                                break;
                                            }
                                        case '310002':
                                            {
                                                $scope.InfoModel('版本错误', 'error');
                                                break;
                                            }
                                        case '310004':
                                            {
                                                $scope.InfoModel('数据格式错误', 'error');
                                                break;
                                            }
                                        default:
                                            {
                                                $scope.InfoModel('导入失败', 'error');
                                                break;
                                            }
                                    }
                                });
                                break;
                            }
                        case 3:
                            // 导入dhc
                            {
                                Api.Import.Dhc({ data: this.result }).$promise.then(function(data) {
                                    $scope.loadingIsEnd = true;
                                    switch (data.statusCode) {
                                        case code:
                                            {
                                                $uibModalInstance.close(true);
                                                break;
                                            }
                                        case '310004':
                                            {
                                                $scope.InfoModel('数据格式错误', 'error');
                                                break;
                                            }
                                        default:
                                            {
                                                $scope.InfoModel('导入失败', 'error');
                                                break;
                                            }
                                    }
                                });
                                break;
                            }
                    }
                };
            } else {
                $scope.InfoModel('格式需为json,txt,export其中一种', 'error');
            }
        }
        $scope.cancel = function() {
            // $uibModalInstance.dismiss(false);
            $uibModalInstance.close(false);
        };

        // 弹窗引用
        $scope.InfoModel = function openModel(info, type, callback) {
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'InfoModel',
                controller: 'InfoModelCtrl',
                resolve: {
                    info: function() {
                        return info;
                    },
                    type: function() {
                        return type;
                    }
                }
            });
            modalInstance.result.then(callback);
        }
    }

    // 确认弹窗控制器
    EnsureModelCtrl.$inject = ['$scope', '$uibModalInstance', '$timeout', 'title', 'necessity', 'info'];

    function EnsureModelCtrl($scope, $uibModalInstance, $timeout, title, necessity, info) {

        $scope.title = title;
        $scope.necessity = necessity;
        $scope.info = info ? info : '确认删除？';
        $scope.ok = function() {
            if ($scope.sureForm.$valid || !$scope.necessity) {
                $uibModalInstance.close(true);
            } else {
                $scope.submited = true;
            }
        };

        $scope.cancel = function() {
            // $uibModalInstance.dismiss(false);
            $uibModalInstance.close(false);
        };
    }

    // 更新弹窗控制器
    UpdateModelCtrl.$inject = ['$scope', '$uibModalInstance', '$timeout', 'Api', 'CODE', 'title', 'info', '$uibModal', '$state'];

    function UpdateModelCtrl($scope, $uibModalInstance, $timeout, Api, CODE, title, info, $uibModal, $state) {
        var code = CODE.SUCCESS;
        $scope.title = title;
        $scope.info = {
            hasNewVersion: false,
            updating: false,
            updateFail: false,
            version: '当前版本为2.1.6，更新时间为2017年4月19日。',
            tips: '',
            updateTips: '',
            ok: '确定',
            cancel: '取消',
            autoUpdateBtn: false,
            manualUpdateBtn: false
        }

        $scope.online = function() { // 选择在线更新，检测更新情况
            Api.Update.Check().$promise.then(function(data) {
                if (data.statusCode == 320002) {
                    $uibModalInstance.close(true);
                    $scope.InfoModel("已是最新版本，无需更新", 'success');
                    $scope.info.hasNewVersion = false
                } else if (data.statusCode == code) {
                    $scope.info = {
                        hasNewVersion: true,
                        autoUpdateBtn: true,
                        manualUpdateBtn: false,
                        updateTips: 'eolinker开源版本有一个新的版本，请问是否开始更新？',
                        tips: '注意，请在更新前停止所有正在进行的操作，否则可能造成数据丢失。',
                        ok: '确定',
                        cancel: '取消'
                    }
                } else if (data.statusCode == 320004) {
                    $uibModalInstance.close(true);
                    $scope.InfoModel("版本更新功能已被禁用，如需启用，请联系网站管理员", 'error');
                } else if (data.statusCode == 320001) {
                    $scope.info = {
                        updating: false,
                        updateFail: true,
                        tips: '无法获取更新信息,请检查网络设置。',
                        ok: '重试',
                        cancel: '取消'
                    }
                }
            })
        };

        $scope.manual = function() { // 选择手动更新
            $scope.info = {
                hasNewVersion: true,
                autoUpdateBtn: false,
                manualUpdateBtn: true,
                updateTips: '请将下载好的最新版eolinker开源版本代码解压到项目根目录，覆盖所有同名文件，完成此操作后，请点击确定按钮，系统将会自动迁移数据。',
                tips: '注意，请在更新前停止所有正在进行的操作，否则可能造成数据丢失。',
                ok: '确定',
                cancel: '取消'
            }
        };

        $scope.autoUpdate = function() { // 开始在线更新
            $scope.info = {
                updating: true,
                manualUpdateBtn: false,
                autoUpdateBtn: false,
            }
            Api.Update.autoUpdate().$promise.then(function(data) {
                if (data.statusCode == code) {
                    $uibModalInstance.close(true);
                    $scope.InfoModel(title + '成功，即将跳回首页', 'success');
                    setTimeout(function() {
                        $state.go('index');
                    }, 3000)
                } else if (data.statusCode == 320003) {
                    $scope.info = {
                        updating: false,
                        updateFail: true,
                        tips: '更新失败，请稍后重试。',
                        ok: '重试',
                        cancel: '取消'
                    }
                } else if (data.statusCode == 320001) {
                    $scope.info = {
                        updating: false,
                        updateFail: true,
                        tips: '无法获取更新信息,请检查网络设置。',
                        ok: '重试',
                        cancel: '取消'
                    }
                } else if (data.statusCode == 320004) {
                    $uibModalInstance.close(true);
                    $scope.InfoModel("版本更新功能已被禁用，如需启用，请联系网站管理员", 'error');
                }
            })
        }

        $scope.manualUpdate = function() { // 开始手动更新
            $scope.info = {
                updating: true,
                manualUpdateBtn: false,
                autoUpdateBtn: false,
            }
            Api.Update.manualUpdate().$promise.then(function(data) {
                if (data.statusCode == code) {
                    $uibModalInstance.close(true);
                    $scope.InfoModel(title + '成功，即将跳回首页', 'success');
                    setTimeout(function() {
                        $state.go('index');
                    }, 3000)
                } else if (data.statusCode == 320003) {
                    $scope.info = {
                        updating: false,
                        updateFail: true,
                        tips: '更新失败，请稍后重试。',
                        ok: '重试',
                        cancel: '取消'
                    }
                } else if (data.statusCode == 320001) {
                    $scope.info = {
                        updating: false,
                        updateFail: true,
                        tips: '无法获取更新信息,请检查网络设置。',
                        ok: '重试',
                        cancel: '取消'
                    }
                } else if (data.statusCode == 320004) {
                    $uibModalInstance.close(true);
                    $scope.InfoModel("版本更新功能已被禁用，如需启用，请联系网站管理员", 'error');
                }
            })
        }
        $scope.cancel = function() {
            // $uibModalInstance.dismiss(false);
            $uibModalInstance.close(false);
        };
        $scope.InfoModel = function openModel(info, type, callback) {
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'InfoModel',
                controller: 'InfoModelCtrl',
                resolve: {
                    info: function() {
                        return info;
                    },
                    type: function() {
                        return type;
                    }
                }
            });
            modalInstance.result.then(callback);
        }
    }

    // 协作信息弹窗控制器
    TeamModelCtrl.$inject = ['$state', '$scope', '$uibModalInstance', '$timeout', 'title', 'Api', 'CODE', '$uibModal'];

    function TeamModelCtrl($state, $scope, $uibModalInstance, $timeout, title, Api, CODE, $uibModal) {
        var code = CODE.SUCCESS;
        var vm = this;
        $scope.title = title;
        $scope.info = {
            userName: '',
            projectID: $state.params.projectID,
            checkPower: false
        };
        $scope.searchInfo = null;
        $scope.query = [];
        $scope.search = {
            submited: false,
            leave: true
        }

        // 初始化计时器
        var countdown = null;

        var init = function() { // 初始化成员列表
            Api.Partner.Query($scope.info).$promise.then(function(data) {
                if (data.statusCode == code) {
                    $scope.query = data.partnerList;
                    $scope.info.checkPower = false;
                    for (var i = 0; i < $scope.query.length; i++) {
                        if ($scope.query[i].isNow == 1 && $scope.query[i].userType == 0) {
                            $scope.info.checkPower = true;
                            return;
                        }
                    }
                } else {
                    $scope.query = [];
                }
            });
        }
        init();

        $scope.closeSearch = function() { // 失焦时关闭搜索结果
            if ($scope.search.leave) {
                $scope.search.submited = false;
                $scope.searchInfo = null;
            }
        }

        $scope.add = function() { // 添加搜索结果为协作成员
            Api.Partner.Add($scope.info).$promise.then(function(data) {
                if (data.statusCode == code) {
                    $scope.searchInfo = null;
                    $scope.search.submited = false;
                    $scope.info.userName = '';
                    init();
                }
            });
        }

        $scope.delete = function(query, index) { // 退出协作或移除协作成员
            var bol = query.isNow == 1 ? true : false;
            if (bol) {
                $scope.EnsureModel('退出协作', false, '确认退出', function(data) {
                    if (data) {
                        Api.Partner.Quit({ 'projectID': $scope.info.projectID }).$promise.then(function(data) {
                            if (data.statusCode == code) {
                                $uibModalInstance.close(false);
                            }
                        });
                    }
                });

            } else {
                $scope.EnsureModel('移除协作', false, '确认移除', function(data) {
                    if (data) {
                        Api.Partner.Delete({ 'projectID': $scope.info.projectID, 'connID': query.connID }).$promise.then(function(data) {
                            if (data.statusCode == code) {
                                $scope.query.splice(index, 1);
                            }
                        });
                    }
                });

            }

        }

        $scope.textChange = function() { // 搜索框内容变化时，1秒后自动请求并修改视图
            // 重置计时器
            if (countdown) {
                clearInterval(countdown);
            }
            $scope.search.submited = false;
            countdown = setInterval(function() {
                $scope.search.submited = true;
                clearInterval(countdown);
            }, 1000);
            setTimeout(function() {
                if ($scope.sureForm.$valid && $scope.search.submited) {
                    clearInterval(countdown);
                    Api.Partner.Search($scope.info).$promise.then(function(data) {
                        if (data.statusCode == code) {
                            $scope.searchInfo = data.userInfo;
                        } else {
                            $scope.searchInfo = null;
                        }

                    })
                }
                // 通知视图变化
                $scope.$digest();
            }, 1000);
        };


        $scope.cancel = function() {
            // $uibModalInstance.dismiss(false);
            $uibModalInstance.close(false);
        };
        $scope.EnsureModel = function openModel(title, necessity, info, callback) {
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'EnsureModel',
                controller: 'EnsureModelCtrl',
                resolve: {
                    title: function() {
                        return title;
                    },
                    necessity: function() {
                        return necessity;
                    },
                    info: function() {
                        return info;
                    }
                }
            });
            modalInstance.result.then(callback);
        }
    }

    // 环境变量设置弹窗控制器
    EnVModelCtrl.$inject = ['$state', '$scope', '$uibModalInstance', '$timeout', 'title', 'info', 'Api', 'CODE', '$uibModal', 'EnvService'];

    function EnVModelCtrl($state, $scope, $uibModalInstance, $timeout, title, info, Api, CODE, $uibModal, EnvService) {
        var code = CODE.SUCCESS;
        var vm = this;
        $scope.title = title;
        $scope.info = {
            projectID: $state.params.projectID,
            envURI: '',
            envName: ''
        };
        $scope.searchInfo = null;
        $scope.query = info;
        $scope.search = {
            submited: false,
            leave: true
        }
        var countdown = null;
        var current = EnvService.get();
        if (!!current) {
            angular.forEach($scope.query, function(val, key) {
                if (current.envID == val.envID) {
                    val.isModel = true;
                }
            })
        } else {
            angular.forEach($scope.query, function(val, key) {
                val.isModel = false;
            })
        }

        $scope.edit = function(query) { // 编辑环境变量
            query.projectID = $scope.info.projectID;
            if (!!query.envName && !!query.envURI) {
                Api.Env.Edit(query).$promise.then(function(data) {
                    if (data.statusCode == code || data.statusCode == '140021') {
                        query.isEdit = !query.isEdit;
                        $scope.submited = false;
                    }
                });
            } else {
                $scope.submited = true;
            }
        }

        $scope.add = function() { // 新增环境变量
            if (!!$scope.info.envName && !!$scope.info.envURI) {
                var info = $scope.info;
                Api.Env.Add($scope.info).$promise.then(function(data) {
                    if (data.statusCode == code) {
                        info.envID = data.envID;
                        $scope.query.push(info);
                        $scope.info = {
                            projectID: $state.params.projectID,
                            envURI: '',
                            envName: ''
                        };
                        $scope.submited = false;
                    }
                });
            } else {
                $scope.submited = true;
            }

        }

        $scope.delete = function(query, index) { // 删除环境变量
            $scope.EnsureModel('删除环境变量', false, '确认移除', function(data) {
                if (data) {
                    Api.Env.Delete({ 'projectID': $scope.info.projectID, 'envID': query.envID }).$promise.then(function(data) {
                        if (data.statusCode == code) {
                            $scope.query.splice(index, 1);
                        }
                    });
                }
            });

        }


        $scope.cancel = function() {
            // $uibModalInstance.dismiss(false);
            $uibModalInstance.close(false);
        };
        $scope.EnsureModel = function openModel(title, necessity, info, callback) {
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'EnsureModel',
                controller: 'EnsureModelCtrl',
                resolve: {
                    title: function() {
                        return title;
                    },
                    necessity: function() {
                        return necessity;
                    },
                    info: function() {
                        return info;
                    }
                }
            });
            modalInstance.result.then(callback);
        }

    }
    // 编辑数据库表字段弹窗控制器
    FieldModelCtrl.$inject = ['$scope', '$uibModalInstance', '$timeout', 'Api', '$uibModal', 'CODE', 'title', 'info'];

    function FieldModelCtrl($scope, $uibModalInstance, $timeout, Api, $uibModal, CODE, title, info) {

        var code = CODE.SUCCESS;
        var vm = this;
        $scope.title = title;
        $scope.info = {
            tableID: info.tableID,
            fieldID: '',
            fieldName: '',
            fieldType: '',
            fieldLength: '',
            isNotNull: '0',
            isPrimaryKey: '0',
            fieldDescription: '',
            isAdd: true
        }
        $scope.query = [];
        $scope.typeList = [
            'tinyint',
            'smallint',
            'mediumint',
            'int',
            'integer',
            'bigint',
            'bit',
            'real',
            'double',
            'float',
            'decimal',
            'numeric',
            'char',
            'varchar',
            'date',
            'time',
            'year',
            'timestamp',
            'datetime',
            'tinyblob',
            'blob',
            'mediumblob',
            'longblob',
            'tinytext',
            'text',
            'mediumtext',
            'longtext',
            'enum',
            'set',
            'binary',
            'varbinary',
            'point',
            'linestring',
            'polygon',
            'geometry',
            'multipoint',
            'multilinestring',
            'multipolygon',
            'geometrycollection'
        ];

        function init() { // 初始化表字段
            if (info.fieldID) {
                $scope.info = {
                    tableID: info.tableID,
                    fieldID: info.fieldID,
                    fieldName: info.fieldName,
                    fieldType: '' + info.fieldType,
                    fieldLength: info.fieldLength,
                    isNotNull: '' + info.isNotNull,
                    isPrimaryKey: '' + info.isPrimaryKey,
                    fieldDescription: info.fieldDescription,
                    isAdd: false
                }
            }
        }
        init();

        $scope.typeSwitch = function(query) { // 通过输入内容判断可能的类型并在下拉列表中显示
            query.labelIsClick = !query.labelIsClick;
            $scope.typeListFilter = [];
            angular.forEach($scope.typeList, function(val, key) {
                if (val.toUpperCase().indexOf(query.fieldType.toUpperCase()) > -1) {
                    $scope.typeListFilter.push(val);
                }
            })
        }

        /*
         *失去焦点时把labelIsClick字段设置为false
         *此时下拉列表隐藏
         */
        $scope.textBlur = function(query) {
            if (query.mouseLeave) {
                query.labelIsClick = false;
            }
        }

        $scope.changeText = function(query, info) { // 选择字段类型
            query.fieldType = info;
            query.labelIsClick = false;
        }

        $scope.changeKey = function() { // 是否有主键
            if ($scope.info.isPrimaryKey) {
                $scope.info.isNotNull = '1';
            }
        }

        $scope.keep = function() { // 继续添加
            $scope.isType = false;
            angular.forEach($scope.typeList, function(val, key) {
                if ($scope.info.fieldType == val) {
                    $scope.isType = true;
                }
            })
            if ($scope.editFieldForm.$valid && $scope.isType) {
                Api.Field.Add($scope.info).$promise.then(function(data) {
                    if (code == data.statusCode) {
                        $scope.submited = false;
                        $scope.info = {
                            tableID: info.tableID,
                            fieldID: '',
                            fieldName: '',
                            fieldType: '',
                            fieldLength: '',
                            isNotNull: '0',
                            isPrimaryKey: '0',
                            fieldDescription: '',
                            isAdd: true
                        }
                        $scope.isType = false;
                    } else {
                        $scope.submited = true;
                    }
                });
            } else {
                $scope.submited = true;
            }
        }

        $scope.ok = function() {
            $scope.isType = false;
            angular.forEach($scope.typeList, function(val, key) {
                if ($scope.info.fieldType == val) {
                    $scope.isType = true;
                }
            })
            if ($scope.editFieldForm.$valid && $scope.isType) {
                if ($scope.info.isAdd) {
                    Api.Field.Add($scope.info).$promise.then(function(data) {
                        if (code == data.statusCode) {
                            $uibModalInstance.close(true);
                        } else {
                            $scope.submited = true;
                        }
                    });
                } else {
                    Api.Field.Update($scope.info).$promise.then(function(data) {
                        if (code == data.statusCode || data.statusCode == '190009') {
                            $uibModalInstance.close(true);
                        } else {
                            $scope.submited = true;
                        }
                    });
                }
            } else {
                $scope.submited = true;
            }
        };

        $scope.cancel = function() {
            // $uibModalInstance.dismiss(false);
            $uibModalInstance.close(false);
        };
    }

    // 添加编辑project输入弹窗控制器
    ProjectModelCtrl.$inject = ['$scope', '$uibModalInstance', '$timeout', 'Api', '$uibModal', 'CODE', 'title', 'info'];

    function ProjectModelCtrl($scope, $uibModalInstance, $timeout, Api, $uibModal, CODE, title, info) {
        var code = CODE.SUCCESS;
        var vm = this;
        $scope.title = title; 
        $scope.info = {
            projectID: '',
            projectName: '',
            projectVersion: '1.0',
            projectType: '0',
            isAdd: true
        }

        function init() { // 初始化项目信息
            if (info) {
                $scope.info = {
                    projectID: info.projectID,
                    projectName: info.projectName,
                    projectVersion: info.projectVersion,
                    projectType: "" + info.projectType + "",
                    isAdd: false
                }
            }
        }
        init();
        $scope.ok = function() {
            if ($scope.editProjectForm.$valid) {
                if ($scope.info.isAdd) {
                    Api.Project.Add($scope.info).$promise.then(function(data) {
                        if (code == data.statusCode) {
                            $uibModalInstance.close(true);
                        } else {
                            $scope.submited = true;
                        }
                    });
                } else {
                    Api.Project.Update($scope.info).$promise.then(function(data) {
                        if (code == data.statusCode) {
                            $uibModalInstance.close(true);
                        } else {

                        }
                    });
                }
            } else {
                $scope.submited = true;
            }
        };

        $scope.cancel = function() {
            // $uibModalInstance.dismiss(false);
            $uibModalInstance.close(false);
        };
    }

    // 添加编辑database输入弹窗控制器
    DatabaseModelCtrl.$inject = ['$scope', '$uibModalInstance', '$timeout', 'Api', '$uibModal', 'CODE', 'title', 'info'];

    function DatabaseModelCtrl($scope, $uibModalInstance, $timeout, Api, $uibModal, CODE, title, info) {
        var code = CODE.SUCCESS;
        var vm = this;
        $scope.title = title;
        $scope.info = {
            dbID: '',
            dbName: '',
            dbVersion: '1.0',
            isAdd: true
        }

        function init() { // 初始化database信息
            if (info) {
                $scope.info = {
                    dbID: info.dbID,
                    dbName: info.dbName,
                    dbVersion: info.dbVersion,
                    isAdd: false
                }
            }
        }
        init();
        $scope.ok = function() {
            if ($scope.editDatabaseForm.$valid) {
                if ($scope.info.isAdd) {
                    Api.Database.Add($scope.info).$promise.then(function(data) {
                        if (code == data.statusCode) {
                            $uibModalInstance.close(true);
                        } else {
                            $scope.submited = true;
                        }
                    });
                } else {
                    Api.Database.Update($scope.info).$promise.then(function(data) {
                        if (code == data.statusCode) {
                            $uibModalInstance.close(true);
                        } else {
                            $scope.submited = true;
                        }
                    });
                }
            } else {
                $scope.submited = true;
            }
        };

        $scope.cancel = function() {
            // $uibModalInstance.dismiss(false);
            $uibModalInstance.close(false);
        };
    }

    // 添加/编辑项目分组弹窗
    GroupModelCtrl.$inject = ['$scope', '$uibModalInstance', '$timeout', 'Api', '$uibModal', 'CODE', 'title', 'info', 'projectID'];

    function GroupModelCtrl($scope, $uibModalInstance, $timeout, Api, $uibModal, CODE, title, info, projectID) {
        var code = CODE.SUCCESS;
        var vm = this;
        $scope.title = title;
        $scope.info = {
            projectID: projectID,
            groupName: '',
            groupID: '',
            isAdd: true
        }

        function init() { // 初始化分组信息
            if (info) {
                $scope.info = {
                    projectID: projectID,
                    groupName: info.groupName,
                    groupID: info.groupID,
                    isAdd: false
                }
            }
        }
        init();
        $scope.ok = function() {
            if ($scope.editGroupForm.$valid) {
                $uibModalInstance.close($scope.info);
            } else {
                $scope.submited = true;
            }
        };

        $scope.cancel = function() {
            // $uibModalInstance.dismiss(false);
            $uibModalInstance.close(false);
        };
    }

    // 添加/编辑数据库表弹窗
    TableModelCtrl.$inject = ['$scope', '$uibModalInstance', '$timeout', 'Api', '$uibModal', 'CODE', 'title', 'info', 'dbID'];

    function TableModelCtrl($scope, $uibModalInstance, $timeout, Api, $uibModal, CODE, title, info, dbID) {
        var code = CODE.SUCCESS;
        var vm = this;
        $scope.title = title;
        $scope.info = {
            dbID: dbID,
            tableID: '',
            tableName: '',
            tableDescription: '',
            isAdd: true
        }

        function init() { // 初始化表信息
            if (info) {
                $scope.info = {
                    dbID: dbID,
                    tableID: info.tableID,
                    tableName: info.tableName,
                    tableDescription: info.tableDescription,
                    isAdd: false
                }
            }
        }
        init();
        $scope.ok = function() {
            if ($scope.editTableForm.$valid) {
                $uibModalInstance.close($scope.info);
            } else {
                $scope.submited = true;
            }
        };

        $scope.cancel = function() {
            // $uibModalInstance.dismiss(false);
            $uibModalInstance.close(false);
        };
    }

    // 添加/编辑状态码输入弹窗
    CodeModelCtrl.$inject = ['$scope', '$uibModalInstance', '$timeout', 'Api', '$uibModal', 'CODE', 'title', 'info', 'GroupService'];

    function CodeModelCtrl($scope, $uibModalInstance, $timeout, Api, $uibModal, CODE, title, info, GroupService) {
        var code = CODE.SUCCESS;
        var codeGroup = GroupService.get(1);;
        $scope.title = title;
        $scope.info = {
            groupID: parseInt(info.groupID),
            childGroupID: info.childGroupID ? parseInt(info.childGroupID) : -1,
            code: '',
            codeDesc: '',
            isAdd: true
        }
        $scope.query = [];
        $scope.childGroup = [{ groupID: -1, groupName: '可选[二级菜单]' }];
        var initChildGroup = [{ groupID: -1, groupName: '可选[二级菜单]' }];

        function init() { // 初始化状态码信息
            $scope.query = codeGroup.groupList;
            if (info.groupID == -1) {
                $scope.info.groupID = $scope.query[0].groupID;
                $scope.info.childGroupID = -1;
            } else {
                if (!!info.parentGroupID) {
                    $scope.info.groupID = parseInt(info.parentGroupID);
                }
                for (var i = 0; i < $scope.query.length; i++) {
                    var val = $scope.query[i];
                    if (val.groupID == $scope.info.groupID) {
                        $scope.childGroup = initChildGroup.concat(val.childGroupList);
                        break;
                    }
                }
            }
            if (info.codeID) {
                $scope.info = {
                    groupID: !!info.parentGroupID ? parseInt(info.parentGroupID) : parseInt(info.groupID),
                    childGroupID: !!info.parentGroupID ? parseInt(info.groupID) : -1,
                    childGroupID: info.childGroupID ? parseInt(info.childGroupID) : -1,
                    codeID: info.codeID,
                    code: info.code,
                    codeDesc: info.codeDescription,
                    isAdd: false
                }
            }

        }
        init();

        $scope.changeChildGroup = function() { // 当分组变动时对应修改其子分组

            for (var i = 0; i < $scope.query.length; i++) {
                var val = $scope.query[i];
                if (val.groupID == $scope.info.groupID) {
                    $scope.childGroup = initChildGroup.concat(val.childGroupList);
                    $scope.info.childGroupID = -1;
                    break;
                }
            }
        }

        $scope.keep = function() { // 继续添加
            if ($scope.editProjectForm.$valid) {
                Api.Code.Add({
                    groupID: $scope.info.childGroupID > 0 ? $scope.info.childGroupID : $scope.info.groupID,
                    codeDesc: $scope.info.codeDesc,
                    code: $scope.info.code
                }).$promise.then(function(data) { 
                    if (code == data.statusCode) {
                        $scope.InfoModel("添加成功！", 'success');
                        $scope.$emit('$numChange',0);
                        $scope.submited = false;
                        $scope.info = {
                            groupID: info.groupID == -1 ? $scope.query[0].groupID : parseInt(info.groupID),
                            childGroupID: info.childGroupID ? parseInt(info.childGroupID) : -1,
                            code: '',
                            codeDesc: '',
                            isAdd: true
                        }
                        for (var i = 0; i < $scope.query.length; i++) {
                            var val = $scope.query[i];
                            if (val.groupID == info.groupID) {
                                $scope.childGroup = initChildGroup.concat(val.childGroupList);
                                break;
                            }
                        }
                    } else {
                        $scope.submited = true;
                    }
                });
            } else {
                $scope.submited = true;
            }
        }
        $scope.ok = function() {
            if ($scope.editProjectForm.$valid) {
                if ($scope.info.isAdd) {
                    Api.Code.Add({
                        groupID: $scope.info.childGroupID > 0 ? $scope.info.childGroupID : $scope.info.groupID,
                        codeDesc: $scope.info.codeDesc,
                        code: $scope.info.code
                    }).$promise.then(function(data) {
                        if (code == data.statusCode) {
                            $scope.$emit('$numChange',0);
                            $uibModalInstance.close(true);
                        } else {
                            $scope.submited = true;
                        }
                    });
                } else {
                    Api.Code.Update({
                        groupID: $scope.info.childGroupID > 0 ? $scope.info.childGroupID : $scope.info.groupID,
                        codeDesc: $scope.info.codeDesc,
                        code: $scope.info.code,
                        codeID: $scope.info.codeID
                    }).$promise.then(function(data) {
                        if (code == data.statusCode || data.statusCode == '190009') {
                            $uibModalInstance.close(true);
                        } else {
                            $scope.submited = true;
                        }
                    });
                }
            } else {
                $scope.submited = true;
            }
        };

        $scope.cancel = function() {
            // $uibModalInstance.dismiss(false);
            $uibModalInstance.close(false);
        };

        // 弹窗引用
        $scope.InfoModel = function openModel(info, type, callback) {
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'InfoModel',
                controller: 'InfoModelCtrl',
                resolve: {
                    info: function() {
                        return info;
                    },
                    type: function() {
                        return type;
                    }
                }
            });
            modalInstance.result.then(callback);
        }
    }

    // JSON转param输入弹窗
    JsonToParamInputModelCtrl.$inject = ['$scope', '$uibModalInstance', '$uibModal'];

    function JsonToParamInputModelCtrl($scope, $uibModalInstance, $uibModal) {
        $scope.ok = function(which) {
            if ($scope.sureForm.$valid) {
                try {
                    JSON.parse($scope.info.desc);
                    $uibModalInstance.close({ which: which, desc: $scope.info.desc });
                } catch (e) {
                    $scope.InfoModel('JSON格式有误', 'error');
                }
            } else {
                $scope.submited = true;
            }
        };

        $scope.cancel = function() {
            $uibModalInstance.close(false);
        };

        //弹窗引用
        $scope.InfoModel = function openModel(info, type, callback) {
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'InfoModel',
                controller: 'InfoModelCtrl',
                resolve: {
                    info: function() {
                        return info;
                    },
                    type: function() {
                        return type;
                    }
                }
            });
            modalInstance.result.then(callback);
        }

    }


})();
