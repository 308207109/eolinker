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
        vm.message = {
            URL: '',
            headers: [],
            params: [],
            httpHeader: '0'
        };
        vm.result = {
            httpCodeType: 2,
            hadTest: false
        };
        vm.send = {
            countdown: '',
            disable: false
        }
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
            vm.message.URL = vm.detail.baseInfo.apiURI;
            vm.message.params = vm.detail.requestInfo != null ? vm.detail.requestInfo : [];
            vm.message.httpHeader = '' + vm.detail.baseInfo.apiProtocol;
            vm.message.requestType = '' + vm.detail.baseInfo.apiRequestParamType;
            vm.message.raw = '' + vm.detail.baseInfo.apiRequestRaw;
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

            $scope.$broadcast('$initReady', { headerQuery: vm.message.headers, URL: vm.message.URL });
            $scope.$emit('$tabChange', { apiName: '[测试]' + vm.detail.baseInfo.apiName, type: 3 });
        }

        function init() { // 初始化接口测试页面
            vm.detail = ApiDetailService.get();
            if (!!vm.detail) {
                $scope.$emit('$windowTitle', { apiName: '[测试]' + vm.detail.baseInfo.apiName });
                vm.message.headers = vm.detail.headers != null ? vm.detail.headers : [];
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
                        vm.message.headers = vm.detail.headerInfo != null ? vm.detail.headerInfo : [];
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
            vm.message.headers.push(info);
        }
        vm.deleteHeaderList = function(index) { // 删除请求头部
            vm.message.headers.splice(index, 1);
        }
        vm.addRequestList = function() { // 添加请求参数
            var info = {
                "paramType": "0",
                "paramKey": "",
                "paramInfo": "",
                "checkbox": true,
                'hasFile': false
            }
            vm.message.params.push(info);
            vm.submited = false;
        }
        vm.deleteRequestList = function(index) { // 删除请求参数
            vm.message.params.splice(index, 1);
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
        vm.enterHistory = function(query) { // 查看历史测试详情
            if (checkDeleteTestHistory) {
                return;
            }
            vm.message.URL = query.requestInfo.URL;
            vm.message.headers = [];
            vm.message.params = [];
            vm.message.raw = '';
            vm.message.requestType = query.requestInfo.requestType;
            vm.message.httpHeader = query.requestInfo.apiProtocol;
            var message = {
                headers: query.requestInfo.headers,
                params: vm.message.requestType == '0' ? query.requestInfo.params : []
            }
            vm.result = {
                testHttpCode: query.resultInfo.httpCode,
                testDeny: query.resultInfo.testDeny,
                testResult: {
                    headers: query.resultInfo.headers
                },
                httpCodeType: query.httpCodeType,
                hadTest: true
            };
            angular.forEach(message.headers, function(val, key) {
                info = {
                    headerName: val.name,
                    headerValue: val.value
                };
                vm.message.headers.push(info);
            });
            if (vm.message.requestType == '0') {
                angular.forEach(message.params, function(val, key) {
                    info = {
                        paramKey: val.key,
                        paramInfo: val.value,
                        paramType:val.type
                    };
                    vm.message.params.push(info);
                });
            } else {
                vm.message.raw = query.requestInfo.params;
            }
            vm.detail.baseInfo.type = '' + query.requestInfo.methodType;
            //console.log(vm.result)
            vm.format.message = query.resultInfo.body;
        }
        vm.changeType = function() { // 切换请求类型
            if (vm.detail.baseInfo.type != '0') {
                vm.message.requestType = '0';
            }
        }

        vm.changeResult = function() {
            vm.isHeader = !vm.isHeader;
        }

        function CurentTime() { // 获取当前时间
            var now = new Date();

            var year = now.getFullYear(); //年
            var month = now.getMonth() + 1; //月
            var day = now.getDate(); //日

            var hh = now.getHours(); //时
            var mm = now.getMinutes(); //分
            var ss = now.getSeconds();

            var clock = year + "-";

            if (month < 10)
                clock += "0";

            clock += month + "-";

            if (day < 10)
                clock += "0";

            clock += day + " ";

            if (hh < 10)
                clock += "0";

            clock += hh + ":";
            if (mm < 10) clock += '0';
            clock += mm + ":";
            if (ss < 10) clock += '0';
            clock += ss;
            return (clock);
        }

        vm.test = function() { // 接口测试
            var info = {
                apiProtocol: vm.message.httpHeader,
                URL: vm.message.URL,
                headers: {},
                params: {},
            }

            //若url中带有http或https，则移除
            if (/(http:\/\/)/.test(info.URL.substring(0, 7))) {
                info.URL = info.URL.substring(7);
            } else if (/(https:\/\/)/.test(info.URL.substring(0, 8))) {
                info.URL = info.URL.substring(8);
            }
            var testHistory = {
                requestInfo: {
                    apiProtocol: info.apiProtocol,
                    URL: info.URL,
                    headers: [],
                    params: [],
                    method: vm.detail.baseInfo.type == '0' ? 'POST' : vm.detail.baseInfo.type == '1' ? 'GET' : vm.detail.baseInfo.type == '2' ? 'PUT' : vm.detail.baseInfo.type == '3' ? 'DELETE' : vm.detail.baseInfo.type == '4' ? 'HEAD' : vm.detail.baseInfo.type == '5' ? 'OPTIONS' : 'PATCH',
                    methodType: vm.detail.baseInfo.type,
                    requestType: vm.message.requestType
                }
            };
            if ($scope.testForm.$valid) {
                angular.forEach(vm.message.headers, function(val, key) {
                    if (val.checkbox) {
                        if (!!val.headerName) {
                            info.headers[val.headerName] = val.headerValue;
                            var history = {
                                name: val.headerName,
                                value: val.headerValue
                            }
                            testHistory.requestInfo.headers.push(history);
                        }
                    }
                });
                if (vm.message.requestType == '0') { 
                    angular.forEach(vm.message.params, function(val, key) {
                        if (val.checkbox) {
                            if (!!val.paramKey) {
                                if(val.paramType=='0'){
                                    val.paramKey = '0'+ val.paramKey;
                                    info.params[val.paramKey] =val.paramInfo;
                                }
                                else {
                                    val.paramKey = '1'+ val.paramKey;
                                    info.params[val.paramKey] = val.file;
                                }
                                // var history = {
                                //     key: val.paramKey,
                                //     value: val.paramInfo
                                // }
                                // testHistory.requestInfo.params.push(history);
                            }
                        }
                    });
                } else {
                    testHistory.requestInfo.params = vm.message.raw;
                }
                var message = {
                    apiProtocol: info.apiProtocol,
                    URL: info.URL,
                    headers: JSON.stringify(info.headers),
                    params: vm.message.requestType == '0' ? JSON.stringify(info.params) : vm.message.raw,
                    apiID: vm.info.apiID,
                    projectID: vm.info.projectID,
                    requestType: vm.message.requestType
                }

                var type = vm.detail.baseInfo.type;
                testHistory.testTime = CurentTime();
                var result = {};
                vm.send.countdown = 0;
                vm.send.disable = true;
                countdown = setInterval(function() {
                    vm.send.countdown++;
                    $scope.$digest(); // 通知视图模型的变化
                }, 1000);
                switch (vm.detail.baseInfo.type) {
                    
                    case '0':
                        Api.Test.Post(message).$promise.then(function(data) {
                            showTestResult(testHistory, data);
                        })
                        break;
                    case '1':
                        Api.Test.Get(message).$promise.then(function(data) {
                            showTestResult(testHistory, data);
                        });
                        break;
                    case '2':
                        Api.Test.Put(message).$promise.then(function(data) {
                            showTestResult(testHistory, data);
                        });
                        break;
                    case '3':
                        Api.Test.Delete(message).$promise.then(function(data) {
                            showTestResult(testHistory, data);
                        });
                        break;
                    case '4':
                        Api.Test.Head(message).$promise.then(function(data) {
                            showTestResult(testHistory, data);
                        });
                        break;
                    case '5':
                        Api.Test.Options(message).$promise.then(function(data) {
                            showTestResult(testHistory, data);
                        });
                        break;
                    case '6':
                        Api.Test.Patch(message).$promise.then(function(data) {
                            showTestResult(testHistory, data);
                        });
                        break;
                }
                if (vm.message.requestType == '0') { 
                    angular.forEach(vm.message.params, function(val, key) {
                        if (val.checkbox) {
                            if (!!val.paramKey) {
                                val.paramKey = val.paramKey.substring(1);
                                var history = {
                                    key: val.paramKey,
                                    value: val.paramInfo
                                }
                                testHistory.requestInfo.params.push(history);
                            }
                        }
                    });
                }
            }
        }

        var showTestResult = function(testHistory, data) { // 显示测试结果
            if (vm.send.disable) {
                if (data.statusCode == code) {
                    vm.result = {
                        testHttpCode: data.testHttpCode,
                        testDeny: data.testDeny,
                        testResult: data.testResult,
                        httpCodeType: data.testHttpCode >= 100 && data.testHttpCode < 200 ? 1 : data.testHttpCode >= 200 && data.testHttpCode < 300 ? 2 : data.testHttpCode >= 300 && data.testHttpCode < 400 ? 3 : 4
                    };
                    var result = vm.result.testResult.body;
                    testHistory.resultInfo = {
                        headers: data.testResult.headers,
                        body: data.testResult.body,
                        httpCode: data.testHttpCode,
                        testDeny: data.testDeny
                    };
                    testHistory.testID = data.testID;
                    testHistory.httpCodeType = data.testHttpCode >= 100 && data.testHttpCode < 200 ? 1 : data.testHttpCode >= 200 && data.testHttpCode < 300 ? 2 : data.testHttpCode >= 300 && data.testHttpCode < 400 ? 3 : 4;
                    var array = [];
                    array.push(testHistory);
                    vm.detail.testHistory = array.concat(vm.detail.testHistory);
                    vm.format.message = result;
                } else {
                    vm.result = {
                        httpCodeType: 5
                    };
                    vm.format.message = '';
                }
                vm.result.hadTest = true;
                clearInterval(countdown);
                vm.send.countdown = null;
                vm.send.disable = false;
            }
        }

        $scope.importFile = function($file) {// 导入文件并获取文件名
            var reader = new FileReader();
            var query = this.$parent.query;
            vm.message.params[query.$index].paramInfo='';
            angular.forEach($file, function(val, key) {
                if(val.size<=2097152){
                    vm.message.params[query.$index].paramInfo = val.name;
                    var reader = new FileReader();//new test
                    reader.readAsDataURL(val);
                    reader.onload = function(evt) {
                    vm.message.params[query.$index].file=this.result;
                    }
                }
                else {
                    vm.InfoModel('上传文件不得超过2M', 'error');
                }
            })
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
