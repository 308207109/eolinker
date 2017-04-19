(function() {
    'use strict';
    /*
     * author：riverLethe
     * 测试指令js
     */
     angular.module('eolinker.directive')

     .directive('testDirective', ['Api', 'CODE', '$filter', '$timeout', '$rootScope','$uibModal', function(Api, CODE, $filter, $timeout, $rootScope,$uibModal) {
        return {
            restrict: 'A',
            transclude: true,
            replace: true,
            template: '<div>' + '<button class="eo-button-info " data-ng-click="test()" >' + ' <span class="iconfont icon-fasong" ng-class="{\'hidden\':send.disable}"></span> {{send.disable?"中止&nbsp;"+(send.countdown>0?send.countdown:""):\'发送\'}}' + '</button>' + '<div class="hidden" id="plug-in-result-js"></div>' + '<div class="hidden" id="plug-in-js">{"method":{{detail.baseInfo.type}},"requestInfo":{{message}},"env":{{envParam}}}</div>' + '</div>',
            scope: {
                message: '=', //双向绑定需要传递给插件的内容
                result: '=', //双向绑定测试后返回结果
                detail: '=', //双向绑定测试初始化getApi内容
                format: '=', //双向绑定格式整理内容
                testForm: '=', //双向绑定基本表单信息是否填写完整
                info: '=', //双向绑定基本的路由信息
                isPlug: '=', //双向绑定是否为插件（用于对界面有无插件的差异性显示）
                envParam: '=' //环境变量全局参数数组
            },
            link: function($scope, elem, attrs, ctrl) {
                var code = CODE.SUCCESS;
                var countdown = null;
                var templateCountdown = null;
                var timer = null;
                $scope.send = {
                    countdown: '',
                    disable: false
                }
                var checkPlug = function() { //检测插件是否存在功能函数
                    if (typeof(chrome) !== 'undefined') {
                        if ((!!navigator.mimeTypes['application/eolinker']) || (window.plug && window.plug.type == "application/eolinker")) {
                            return true;
                        } else {
                            return false;
                        }
                    }
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
                var envSet = function(origin) {
                    if ($scope.envParam.length > 0) {
                        var templateResult = {};
                        angular.copy(origin, templateResult);
                        angular.forEach($scope.envParam, function(val, key) {
                            templateResult.URL = templateResult.URL.replace(eval('/({{' + val.paramKey + '}})/g'), val.paramValue);
                            angular.forEach(templateResult.headers, function(val1, key1) {

                                val1.headerName = val1.headerName.replace(eval('/({{' + val.paramKey + '}})/g'), val.paramValue);
                            })
                            angular.forEach(templateResult.params, function(val1, key1) {

                                val1.paramKey = val1.paramKey.replace(eval('/({{' + val.paramKey + '}})/g'), val.paramValue);
                            })
                        })
                        return templateResult;
                    } else {
                        return origin;
                    }
                }
                var serverTest = function() { //服务器测试调用功能函数
                    if (!$scope.send.disable) {
                        var info = {
                            apiProtocol: $scope.message.httpHeader,
                            URL: $scope.message.URL,
                            headers: {},
                            params: {},
                        }
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
                                method: $scope.detail.baseInfo.type == '0' ? 'POST' : $scope.detail.baseInfo.type == '1' ? 'GET' : $scope.detail.baseInfo.type == '2' ? 'PUT' : $scope.detail.baseInfo.type == '3' ? 'DELETE' : $scope.detail.baseInfo.type == '4' ? 'HEAD' : $scope.detail.baseInfo.type == '5' ? 'OPTIONS' : 'PATCH',
                                methodType: $scope.detail.baseInfo.type,
                                requestType: $scope.message.requestType
                            }
                        };
                        var template = envSet($scope.message);
                        info = envSet(info);
                        if ($scope.testForm.$valid) {
                            angular.forEach(template.headers, function(val, key) {
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
                            if ($scope.message.requestType == '0') {
                                angular.forEach(template.params, function(val, key) {
                                    if (val.checkbox) {
                                        if (!!val.paramKey) {
                                            info.params[val.paramKey] = val.paramInfo;
                                            var history = {
                                                key: val.paramKey,
                                                value: val.paramInfo
                                            }
                                            testHistory.requestInfo.params.push(history);
                                        }
                                    }
                                });
                            } else {
                                testHistory.requestInfo.params = $scope.message.raw;
                            }
                            var message = {
                                apiProtocol: info.apiProtocol,
                                URL: info.URL,
                                headers: angular.toJson(info.headers),
                                params: $scope.message.requestType == '0' ? angular.toJson(info.params) : $scope.message.raw,
                                apiID: $scope.info.apiID,
                                projectHashKey: $scope.info.projectHashKey,
                                requestType: $scope.message.requestType
                            }
                            var type = $scope.detail.baseInfo.type;
                            testHistory.testTime = CurentTime();
                            var result = {};
                            $scope.send.countdown = 0;
                            $scope.send.disable = true;
                            countdown = setInterval(function() {
                                $scope.send.countdown++;
                                    $scope.$digest(); // 通知视图模型的变化
                                }, 1000);
                            switch ($scope.detail.baseInfo.type) {
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
                        }
                    } else {
                        clearInterval(countdown);
                        $scope.send.countdown = null;
                        $scope.send.disable = false;
                    }
                }
                var showTestResult = function(testHistory, data) { //显示测试结果调用功能函数
                    if ($scope.send.disable) {
                        if (data.statusCode == code) {
                            $scope.result = {
                                testHttpCode: data.testHttpCode,
                                testDeny: data.testDeny,
                                testResult: data.testResult,
                                httpCodeType: data.testHttpCode >= 100 && data.testHttpCode < 200 ? 1 : data.testHttpCode >= 200 && data.testHttpCode < 300 ? 2 : data.testHttpCode >= 300 && data.testHttpCode < 400 ? 3 : 4
                            };
                            var result = $scope.result.testResult.body;
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
                            $scope.detail.testHistory = array.concat($scope.detail.testHistory);
                            $scope.format.message = result;
                        } else {
                            $scope.result = {
                                httpCodeType: 5
                            };
                            $scope.format.message = '';
                            document.getElementById('apiResult_js').innerText='';
                        }
                        $scope.result.hadTest = true;
                        clearInterval(countdown);
                        $scope.send.countdown = null;
                        $scope.send.disable = false;
                    }
                }
                var plugTest = function(testHistory) { //插件测试调用功能函数
                    var data = {};
                    try {
                        data = JSON.parse($filter('HtmlFilter')(document.getElementById('plug-in-result-js').innerText));
                        console.log(data)
                    } catch (e) {
                        console.log("error");
                        data = {
                            statusCode: '2xxxxx'
                        }
                    }
                    if (data.statusCode == code) {
                        $scope.result = {
                            testHttpCode: data.testHttpCode,
                            testDeny: data.testDeny,
                            testResult: data.testResult,
                            httpCodeType: data.testHttpCode >= 100 && data.testHttpCode < 200 ? 1 : data.testHttpCode >= 200 && data.testHttpCode < 300 ? 2 : data.testHttpCode >= 300 && data.testHttpCode < 400 ? 3 : 4
                        };
                        var result = $scope.result.testResult.body;
                        testHistory.resultInfo = {
                            headers: data.testResult.headers,
                            body: (typeof result == 'object') ? angular.toJson(data.testResult.body) : data.testResult.body,
                            httpCode: data.testHttpCode,
                            testDeny: data.testDeny
                        };
                        testHistory.testID = data.testID;
                        testHistory.httpCodeType = data.testHttpCode >= 100 && data.testHttpCode < 200 ? 1 : data.testHttpCode >= 200 && data.testHttpCode < 300 ? 2 : data.testHttpCode >= 300 && data.testHttpCode < 400 ? 3 : 4;
                        var array = [];
                        array.push(testHistory);
                        $scope.detail.testHistory = array.concat($scope.detail.testHistory);
                        if (typeof result == 'object') {
                            $scope.format.message = angular.toJson(result);
                        } else {
                            $scope.format.message = result;
                        }
                    } else {
                        $scope.result = {
                            httpCodeType: 5
                        };
                        if (data.errorText) {
                            $scope.format.message = data.errorText;
                        } else {
                            $scope.format.message = '';
                            document.getElementById('apiResult_js').innerText='';
                        }
                    }
                    $scope.result.hadTest = true;
                    clearInterval(templateCountdown);
                    clearInterval(countdown);
                    $scope.send.countdown = null;
                    $scope.send.disable = false;
                    $scope.$apply();
                }
                var init = function() { //初始化，判断是否存在插件功能函数
                    $scope.isPlug = checkPlug();
                }
                init();
                timer = $timeout(function() { //初始化，判断是否存在插件功能函数（页面加载完成时执行）
                    if (!$scope.isPlug) {
                        init();
                    }
                }, 0, true);
                $scope.test = function() { //绑定click，执行测试功能函数
                    if (!$scope.send.disable) {
                        if (checkPlug()) {
                            document.getElementById('plug-in-result-js').innerText = '';
                            var info = {
                                apiProtocol: $scope.message.httpHeader,
                                URL: $scope.message.URL,
                                headers: {},
                                params: {},
                            }
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
                                    method: $scope.detail.baseInfo.type == '0' ? 'POST' : $scope.detail.baseInfo.type == '1' ? 'GET' : $scope.detail.baseInfo.type == '2' ? 'PUT' : $scope.detail.baseInfo.type == '3' ? 'DELETE' : $scope.detail.baseInfo.type == '4' ? 'HEAD' : $scope.detail.baseInfo.type == '5' ? 'OPTIONS' : 'PATCH',
                                    methodType: $scope.detail.baseInfo.type,
                                    requestType: $scope.message.requestType
                                }
                            };
                            var template = envSet($scope.message);
                            if ($scope.testForm.$valid) {
                                angular.forEach(template.headers, function(val, key) {
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
                                if ($scope.message.requestType == '0') {
                                    angular.forEach(template.params, function(val, key) {
                                        if (val.checkbox) {
                                            if (!!val.paramKey) {
                                                info.params[val.paramKey] = val.paramInfo;
                                                var history = {
                                                    key: val.paramKey,
                                                    value: val.paramInfo
                                                }
                                                testHistory.requestInfo.params.push(history);
                                            }
                                        }
                                    });
                                } else {
                                    testHistory.requestInfo.params = $scope.message.raw;
                                }
                                var type = $scope.detail.baseInfo.type;
                                testHistory.testTime = CurentTime();
                                var result = {};
                                $scope.send.countdown = 0;
                                $scope.send.disable = true;
                                templateCountdown = setInterval(function() {
                                    if (!!document.getElementById('plug-in-result-js').innerText) {
                                        plugTest(testHistory);
                                    }
                                }, 10);
                                countdown = setInterval(function() {
                                    $scope.send.countdown++;
                                    $scope.$digest(); // 通知视图模型的变化
                                    if ($scope.send.countdown == 60) {
                                        $scope.result = {
                                            httpCodeType: 5
                                        };
                                        $scope.format.message = '';
                                        document.getElementById('apiResult_js').innerText='';
                                        $scope.isJson = false;
                                        $scope.result.hadTest = true;
                                        clearInterval(countdown);
                                        clearInterval(templateCountdown);
                                        $scope.send.countdown = null;
                                        $scope.send.disable = false;
                                        $scope.$digest();
                                    }
                                }, 1000);
                            }
                            } else {
                                serverTest();
                            }
                            } else {
                                clearInterval(templateCountdown);
                                clearInterval(countdown);
                                $scope.send.countdown = null;
                                $scope.send.disable = false;
                            }
                        }
                $scope.$on('$destroy', function() { //销毁页面时销毁计时器
                    if (timer) {
                        $timeout.cancel(timer);
                    }
                });
                $scope.$on('$stateChangeStart', function() { //路由开始转换时清除计时器
                    if (!!templateCountdown) {
                        clearInterval(templateCountdown);
                    }
                    if (!!countdown) {
                        clearInterval(countdown);
                    }
                })
                var PlugModel = function openModel(title, info, callback) {
                    var modalInstance = $uibModal.open({
                        animation: true,
                        templateUrl: 'PlugModel',
                        controller: 'PlugModelCtrl',
                        resolve: {
                            title: function() {
                                return title;
                            },
                            info: function() {
                                return info;
                            }
                        }
                    });
                    modalInstance.result.then(callback);
                }
            }
        };
    }]);
})();
