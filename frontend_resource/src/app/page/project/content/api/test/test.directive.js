(function() {
    /* 接口测试指令 */
    angular.module('eolinker').directive('projectApiTest', ['$timeout', "$window", function($timeout, $window, EVENT) {
        return {
            restrict: 'AE',
            templateUrl: 'app/page/project/content/api/test/test.html',
            // replace:true,
            controller: projectApiTestCtroller,
            controllerAs: 'projectApiTestCtrl'
        }
    }])

    projectApiTestCtroller.$inject = ['$scope', 'Api', '$state', '$window', 'CODE', '$timeout', '$uibModal', '$rootScope', '$filter', 'ApiDetailService'];

    function projectApiTestCtroller($scope, Api, $state, $window, CODE, $timeout, $uibModal, $rootScope, $filter, ApiDetailService) {
        var vm = this;
        var code = CODE.SUCCESS; 
        vm.info = {
            projectID: $state.params.projectID,
            groupID: $state.params.groupID,
            apiID: $state.params.apiID
        }
        vm.detail = {};
        vm.env = {
            URL: '',
            headers: [],
            params: [],
            httpHeader: '0'
        };
        vm.envParam=[];
        vm.template={
            env:{}
        }
        vm.result = {
            httpCodeType: 2,
            hadTest: false
        };
        vm.envInfo = {
            envURI: '',
            isShow: false
        }
        vm.format = {
            isJson: true,
            message: ''
        }
        var countdown = null;
        var templateCountdown = null;
        var checkDeleteTestHistory = false;
        vm.resultType = 0;
        vm.projectDetail = {};
        vm.requestHeaderArray = [
            'Accept', 'Accept-Charset', 'Accept-Encoding', 'Accept-Language', 'Accept-Ranges', 'Authorization',
            'Cache-Control', 'Connection', 'Cookie', 'Content-Length', 'Content-Type',
            'Date',
            'Expect',
            'From',
            'Host',
            'If-Match', 'If-Modified-Since', 'If-None-Match', 'If-Range', 'If-Unmodified-Since',
            'Max-Forwards',
            'Pragma', 'Proxy-Authorization',
            'Range', 'Referer',
            'TE',
            'Upgrade', 'User-Agent',
            'Via',
            'Warning'
        ];

        var initMessage = function() { // 初始化测试信息
            if (vm.info.groupID == -2) {
                vm.trash = true;
            } else {
                vm.trash = false;
            }
            vm.detail.testHistory = vm.detail.testHistory != null ? vm.detail.testHistory : [];
            angular.forEach(vm.detail.testHistory, function(val, key) {
                if (val.requestInfo == null) {
                    val.requestInfo = {
                        apiProtocol: '0',
                        method: 'error',
                        URL: 'error'
                    };
                }
                if (val.resultInfo == null) {
                    val.resultInfo = {
                        'body': 'error',
                        'headers': [],
                        'httpCode': 500,
                        'testDeny': 0
                    };
                }
                val.requestInfo.methodType = val.requestInfo.method == 'POST' ? 0 : val.requestInfo.method == 'GET' ? 1 : val.requestInfo.method == 'PUT' ? 2 : val.requestInfo.method == 'DELETE' ? 3 : val.requestInfo.method == 'HEAD' ? 4 : val.requestInfo.method == 'OPTIONS' ? 5 : 6;
                val.httpCodeType = val.resultInfo.httpCode >= 100 && val.resultInfo.httpCode < 200 ? 1 : val.resultInfo.httpCode >= 200 && val.resultInfo.httpCode < 300 ? 2 : val.resultInfo.httpCode >= 300 && val.resultInfo.httpCode < 400 ? 3 : 4;
                val.requestInfo.URL = val.requestInfo.URL.replace('http://', '');
            })
            vm.env.URL = vm.detail.baseInfo.apiURI;
            vm.env.params = vm.detail.requestInfo != null ? vm.detail.requestInfo : [];
            vm.env.httpHeader = '' + vm.detail.baseInfo.apiProtocol;
            vm.env.requestType = '' + vm.detail.baseInfo.apiRequestParamType;
            vm.env.raw = '' + vm.detail.baseInfo.apiRequestRaw;
            vm.detail.baseInfo.type = '' + vm.detail.baseInfo.apiRequestType;
            angular.forEach(vm.detail.requestInfo, function(val, key) {
                if(vm.detail.baseInfo.type!='0'&&vm.detail.baseInfo.type!='2'){
                    val.paramType = 0;
                }
                val.paramValueQuery = [];
                val.paramInfo = '';
                val.paramType = ''+val.paramType;
                angular.forEach(val.paramValueList, function(value, key) {
                    val.paramValueQuery.push(value.value);
                })
            });

            $scope.$broadcast('$initReady', { headerQuery: vm.env.headers, URL: vm.env.URL });
            $scope.$emit('$tabChange', { apiName: '[测试]' + vm.detail.baseInfo.apiName, type: 3 });
        }

        function init() { // 初始化接口测试页面
            vm.detail = ApiDetailService.get();
            if (!!vm.detail) {
                $scope.$emit('$windowTitle', { apiName: '[测试]' + vm.detail.baseInfo.apiName });
                vm.env.headers = vm.detail.headerInfo != null ? vm.detail.headerInfo : [];
                initMessage();
            } else {
                Api.Api.Detail({ projectHashKey: vm.info.projectHashKey, groupID: vm.info.childGroupID ? vm.info.childGroupID : vm.info.groupID, apiID: vm.info.apiID }).$promise.then(function(data) {
                    if (code == data.statusCode) {
                        vm.detail = data.apiInfo;
                        $scope.$emit('$windowTitle', { apiName: '[测试]' + vm.detail.baseInfo.apiName });
                        switch (data.apiInfo.baseInfo.apiRequestType) {
                            case 0:
                            case '0':
                                vm.detail.baseInfo.type = 'POST';
                                break;
                            case 1:
                            case '1':
                                vm.detail.baseInfo.type = 'GET';
                                break;
                            case 2:
                            case '2':
                                vm.detail.baseInfo.type = 'PUT';
                                break;
                            case 3:
                            case '3':
                                vm.detail.baseInfo.type = 'DELETE';
                                break;
                            case 4:
                            case '4':
                                vm.detail.baseInfo.type = 'HEAD';
                                break;
                            case 5:
                            case '5':
                                vm.detail.baseInfo.type = 'OPTS';
                                break;
                            case 6:
                            case '6':
                                vm.detail.baseInfo.type = 'PATCH';
                                break;
                        }
                        switch (data.apiInfo.baseInfo.apiSuccessMockType) {
                            case 0:
                            case '0':
                                {
                                    vm.detail.baseInfo.successMockType = 'JSON';
                                    break;
                                }
                            case 1:
                            case '1':
                                {
                                    vm.detail.baseInfo.successMockType = 'XML';
                                    break;
                                }
                            case 2:
                            case '2':
                                {
                                    vm.detail.baseInfo.successMockType = 'HTML';
                                    break;
                                }
                            case 3:
                            case '3':
                                vm.detail.baseInfo.successMockType = '其他';
                                break;
                        }
                        switch (data.apiInfo.baseInfo.apiFailureMockType) {
                            case 0:
                            case '0':
                                {
                                    vm.detail.baseInfo.failureMockType = 'JSON';
                                    break;
                                }
                            case 1:
                            case '1':
                                {
                                    vm.detail.baseInfo.failureMockType = 'XML';
                                    break;
                                }
                            case 2:
                            case '2':
                                {
                                    vm.detail.baseInfo.failureMockType = 'HTML';
                                    break;
                                }
                            case 3:
                            case '3':
                                vm.detail.baseInfo.failureMockType = '其他';
                                break;
                        }
                        switch (data.apiInfo.baseInfo.apiProtocol) {
                            case 0:
                            case '0':
                                vm.detail.baseInfo.protocol = 'HTTP';
                                break;
                            case 1:
                            case '1':
                                vm.detail.baseInfo.protocol = 'HTTPS';
                                break;
                        }
                        switch (data.apiInfo.baseInfo.apiStatus) {
                            case 0:
                            case '0':
                                vm.detail.baseInfo.status = '启用';
                                break;
                            case 1:
                            case '1':
                                vm.detail.baseInfo.status = '维护';
                                break;
                            case 2:
                            case '2':
                                vm.detail.baseInfo.status = '弃用';
                                break;
                        }
                        vm.env.headers = vm.detail.headerInfo != null ? vm.detail.headerInfo : [];
                        initMessage();
                    } else {
                        vm.detail = {};
                    }
                })
            }
        }
        var timer = $timeout(function() {
            init();
        });
        vm.goDetail = function() { // 跳转接口详情页面
            $state.go('project.api.detail', { 'projectID': vm.info.projectID, 'groupID': vm.info.groupID, 'apiID': vm.info.apiID });
        }
        vm.saveTo = function() { // 接口另存为
            $state.go('project.api.edit', { 'projectID': vm.info.projectID, 'groupID': vm.info.groupID, 'apiID': vm.info.apiID, 'type': 2 });
        }
        vm.addHeaderList = function() { // 添加请求头部
            var info = {
                "headerName": '',
                "headerValue": '',
                "checkbox": true
            }
            vm.env.headers.push(info);
        }
        vm.deleteHeaderList = function(index) { // 删除请求头部
            vm.env.headers.splice(index, 1);
        }
        vm.addRequestList = function() { // 添加请求参数
            var info = {
                "paramType": "0",
                "paramKey": "",
                "paramInfo": "",
                "checkbox": true,
                'hasFile': false
            }
            vm.env.params.push(info);
            vm.submited = false;
        }
        vm.deleteRequestList = function(index) { // 删除请求参数
            vm.env.params.splice(index, 1);
        }
        vm.newWindow = function() { // “新开页面”按钮
            if (vm.format.message) {
                var w = window.open();
                w.document.open();
                w.document.write(vm.format.message);
                w.document.close();
            }
        }
        vm.back = function() { // 跳转接口列表页面
            if (vm.info.groupID != -2) {
                $state.go('project.api.list', { 'projectID': $state.params.projectID, 'groupID': $state.params.groupID });
            } else {
                $state.go('project.api.trash', { 'projectID': $state.params.projectID, 'groupID': $state.params.groupID });
            }
        }
        vm.edit = function() { // 跳转编辑接口页面
            $state.go('project.api.edit', vm.info);
        }
        vm.delete = function(apiID) { // 删除接口
            vm.EnsureModel('删除Api', false, '确认删除', function(data) {
                if (data) {
                    Api.Api.Delete({ apiID: apiID }).$promise.then(function(data) {
                        if (data.statusCode == code) {
                            vm.back();
                            $scope.$emit('$numChange',1);
                            vm.InfoModel('Api删除成功，已移入回收站', 'success');
                        }
                    })
                }
            });
        }
        vm.recover = function(apiID) { // 从回收站中恢复接口
            Api.Trash.Recover({ apiID: apiID }).$promise.then(function(data) {
                if (data.statusCode == code) {
                    vm.back();
                }
            })
        }
        vm.deleteCompletely = function(apiID) { // 彻底删除接口
            vm.EnsureModel('永久性删除Api', false, '此操作无法恢复，确认删除？', function(data) {
                if (data) {
                    Api.Trash.Delete({ apiID: apiID }).$promise.then(function(data) {
                        if (data.statusCode == code) {
                            vm.back();
                            vm.InfoModel('Api删除成功', 'success');
                        } else {
                            vm.InfoModel('删除失败，请稍候再试或到论坛提交bug', 'error');
                        }
                    })
                }
            });
        }
        vm.changeResult = function() { // 切换header/body
            vm.isHeader = !vm.isHeader;
        }
        vm.deleteTestList = function(testID, index) { // 删除测试地址
            checkDeleteTestHistory = true;
            vm.EnsureModel('删除此项历史记录', false, '确认删除', function(data) {
                if (data) {
                    Api.Test.DeleteHistory({ testID: testID }).$promise.then(function(data) {
                        if (data.statusCode == code) {
                            vm.InfoModel('记录删除成功!', 'success');
                            vm.detail.testHistory.splice(index, 1);
                            window.localStorage.setItem('APIDETAIL', JSON.stringify(vm.detail));
                        }
                        else {
                            vm.InfoModel('记录删除失败，请稍后重试!','error')
                        }
                        checkDeleteTestHistory = false;
                    })
                } else {
                    checkDeleteTestHistory = false;
                }
            });

        }
        vm.enterHistory = function(query) {// 查看历史测试详情
            if (checkDeleteTestHistory) {
                return;
            }
            vm.env.URL = query.requestInfo.URL;
            vm.env.headers = [];
            vm.env.params = [];
            vm.env.raw = '';
            vm.env.requestType = query.requestInfo.requestType;
            vm.env.httpHeader = query.requestInfo.apiProtocol;
            var info = {};
            vm.result = {
                testHttpCode: query.resultInfo.httpCode,
                testDeny: query.resultInfo.testDeny,
                testResult: {
                    headers: query.resultInfo.headers
                },
                httpCodeType: query.httpCodeType,
                hadTest: true
            };
            angular.forEach(query.requestInfo.headers, function(val, key) {
                info = {
                    headerName: val.name,
                    headerValue: val.value
                };
                vm.env.headers.push(info);
            });
            if (vm.env.requestType == '0') {
                angular.forEach(query.requestInfo.params, function(val, key) {
                    info = {
                        paramKey: val.key,
                        paramInfo: val.value
                    };
                    vm.env.params.push(info);
                });
            } else {
                vm.env.params = [];
                vm.env.raw = query.requestInfo.params;
            }
            vm.detail.baseInfo.type = '' + query.requestInfo.methodType;
            vm.format.message = query.resultInfo.body;
        }
        vm.changeType = function() { // 切换请求类型
            if (vm.detail.baseInfo.type != '0') {
                vm.env.requestType = '0';
            }
        }

        vm.changeResult = function() {
            vm.isHeader = !vm.isHeader;
        }

        $scope.importFile = function($files) {// 导入文件并获取文件名
            var $index = this.$parent.$index;
            vm.env.params[$index].paramInfo = '';
            for (var i = 0; i < $files.length; i++) {
                var val = $files[i];
                if (val.size > 2 * 1024 * 1024) {
                    vm.env.params[$index].paramInfo = '';
                    vm.env.params[$index.files] = [];
                    vm.InfoModel('文件大小均需小于2M', 'error');
                    break;
                } else {
                    vm.env.params[$index].paramInfo = val.name + ',' + vm.env.params[$index].paramInfo;
                    var reader = new FileReader(); //new test
                    reader.readAsDataURL(val);
                    vm.env.params[$index].files = [];
                    reader.onload = function(evt) {
                        vm.env.params[$index].files.push(this.result);
                    }
                }

            }
            vm.env.params[$index].paramInfo=vm.env.params[$index].paramInfo.slice(0, vm.env.params[$index].paramInfo.length-1);
            $scope.$digest();
        }

        $scope.$on('$stateChangeStart', function() { // 路由状态开始改变时触发
            if (!!templateCountdown) {
                clearInterval(templateCountdown);
            }
            if (!!countdown) {
                clearInterval(countdown);
            }
        })

        $scope.$on('$destroy', function() { // 页面跳转触发事件
            if (timer) {
                $timeout.cancel(timer);
            }
        });
        //弹窗引用
        vm.InfoModel = function openModel(info, type, callback) {
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
        vm.EnsureModel = function openModel(title, necessity, info, callback) {
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

})();
