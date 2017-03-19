(function() {
    /* 接口详情指令 */
    angular.module('eolinker').directive('projectApiDetail', ['$timeout', "$window", function($timeout, $window, EVENT) {
        return {
            restrict: 'AE',
            templateUrl: 'app/page/project/content/api/detail/detail.html',
            // replace:true,
            controller: projectApiDetailCtroller,
            controllerAs: 'projectApiDetailCtrl'
        }
    }])

    projectApiDetailCtroller.$inject = ['$scope', '$sce', '$rootScope', '$timeout', 'Api', '$state', '$window', 'CODE', '$uibModal', '$compile', '$filter', 'ApiDetailService'];

    function projectApiDetailCtroller($scope, $sce, $rootScope, $timeout, Api, $state, $window, CODE, $uibModal, $compile, $filter, ApiDetailService) {
        var vm = this;
        var code = CODE.SUCCESS;
        vm.info = {
            apiID: $state.params.apiID,
            projectID: $state.params.projectID,
            groupID: $state.params.groupID,
            childGroupID: $state.params.childGroupID
        }
        vm.detail = {};
        vm.envInfo = {
            envURI: '',
            isShow: false
        }
        vm.format = {
            successMock: true,
            failureMock: true
        }
        vm.loadingIsEnd = true;

        function init() {// 初始化接口详情页面
            vm.loadingIsEnd = false;
            if (vm.info.groupID == -2) {
                vm.trash = true;
            } else {
                vm.trash = false;
            }
            Api.Api.Detail({ projectID: vm.info.projectID, groupID: vm.info.childGroupID ? vm.info.childGroupID : vm.info.groupID, apiID: vm.info.apiID }).$promise.then(function(data) {
                vm.loadingIsEnd = true;
                if (code == data.statusCode) {
                    vm.detail = data.apiInfo;
                    $scope.$emit('$windowTitle', { apiName: '[详情]' + vm.detail.baseInfo.apiName });
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
                    angular.forEach(vm.detail.requestInfo, function(val, key) {
                        if (val.paramKey.indexOf("::") > -1 || val.paramKey.indexOf(">>") > -1) {
                            var templateParamKeyQuery = val.paramKey.split(/[:]{2}|[>]{2}/);
                            angular.forEach(templateParamKeyQuery, function(value, key) {
                                if (!val.paramKeyHtml) {
                                    val.paramKeyHtml = value;
                                } else {
                                    val.paramKeyHtml = val.paramKeyHtml + '<span class="iconfont icon-right"></span>' + value;
                                }
                            })
                            val.paramKeyHtml = $sce.trustAsHtml(val.paramKeyHtml)
                        } else {
                            val.paramKeyHtml = $sce.trustAsHtml(val.paramKey)
                        }
                        switch (val.paramType) {
                            case 0:
                            case '0':
                                val.paramTypeHTML = '[text]';
                                break;
                            case 1:
                            case '1':
                                val.paramTypeHTML = '[file]';
                                break;
                            case 2:
                            case '2':
                                val.paramTypeHTML = '[json]';
                                break;
                            case 3:
                            case '3':
                                val.paramTypeHTML = '[int]';
                                break;
                            case 4:
                            case '4':
                                val.paramTypeHTML = '[float]';
                                break;
                            case 5:
                            case '5':
                                val.paramTypeHTML = '[double]';
                                break;
                            case 6:
                            case '6':
                                val.paramTypeHTML = '[date]';
                                break;
                            case 7:
                            case '7':
                                val.paramTypeHTML = '[datetime]';
                                break;
                            case 8:
                            case '8':
                                val.paramTypeHTML = '[boolean]';
                                break;
                            case 9:
                            case '9':
                                val.paramTypeHTML = '[byte]';
                                break;
                            case 10:
                            case '10':
                                val.paramTypeHTML = '[short]';
                                break;
                            case 11:
                            case '11':
                                val.paramTypeHTML = '[long]';
                                break;
                        }
                    })
                    angular.forEach(vm.detail.resultInfo, function(val, key) {
                        if (val.paramKey.indexOf("::") > -1 || val.paramKey.indexOf(">>") > -1) {
                            var templateParamKeyQuery = val.paramKey.split(/[:]{2}|[>]{2}/);
                            angular.forEach(templateParamKeyQuery, function(value, key) {
                                if (!val.paramKeyHtml) {
                                    val.paramKeyHtml = value;
                                } else {
                                    val.paramKeyHtml = val.paramKeyHtml + '<span class="iconfont icon-right"></span>' + value;
                                }
                            })
                            val.paramKeyHtml = $sce.trustAsHtml(val.paramKeyHtml)
                                //console.log(val.paramKeyHtml)
                        } else {
                            val.paramKeyHtml = $sce.trustAsHtml(val.paramKey)
                        }
                    })
                    vm.detail.baseInfo.apiNote = $sce.trustAsHtml($filter('XssFilter')(vm.detail.baseInfo.apiNote));
                    vm.detail.baseInfo.successMockCode = vm.detail.baseInfo.successMockURL;
                    vm.detail.baseInfo.failureMockCode = vm.detail.baseInfo.failureMockURL;
                    ApiDetailService.set(vm.detail);
                }
            })
        }
        var timer = $timeout(function() {
            init();
        });

        vm.changeMockStatus = function() {// 切换成功/失败结果
            vm.isSuccess = !vm.isSuccess;
        }
        vm.back = function() {// 跳转接口列表页面
            if (vm.info.groupID != -2) {
                $state.go('project.api.list', { 'projectID': $state.params.projectID, 'groupID': $state.params.groupID, 'childGroupID': vm.info.childGroupID });
            } else {
                $state.go('project.api.trash', { 'projectID': $state.params.projectID, 'groupID': $state.params.groupID });
            }
        }
        vm.goTest = function() {// 跳转测试页面
            $state.go('project.api.test', { 'projectID': vm.info.projectID, 'groupID': vm.info.groupID, 'childGroupID': vm.info.childGroupID, 'apiID': vm.info.apiID });
        }
        vm.showRequestValue = function(info) {// 查看参考示例
            vm.MessageModel(info.paramKey.substr(0, 50) + '-参考示例', info.paramValue, function(data) {});
        }
        vm.edit = function() {// 跳转编辑接口页面
            $state.go('project.api.edit', vm.info);
        }
        vm.saveTo = function() {// 接口另存为（跳转编辑接口页面）
            $state.go('project.api.edit', { 'projectID': vm.info.projectID, 'groupID': vm.info.groupID, 'childGroupID': vm.info.childGroupID, 'apiID': vm.info.apiID, 'type': 2 });
        }
        vm.delete = function(apiID) {// 删除接口
            vm.EnsureModel('删除Api', false, '确认删除', function(data) {
                if (data) {
                    Api.Api.Delete({ apiID: apiID }).$promise.then(function(data) {
                        if (data.statusCode == code) {
                            vm.back();
                            vm.InfoModel('Api删除成功，已移入回收站', 'success');
                            $scope.$emit('$numChange',1);
                        }
                    })
                }
            });
        }
        vm.recover = function(apiID) {// 从回收站中恢复接口
            Api.Trash.Recover({ apiID: apiID }).$promise.then(function(data) {
                if (data.statusCode == code) {
                    vm.back();
                }
            })
        }
        vm.deleteCompletely = function(apiID) {// 彻底删除接口
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
        vm.storage = function() {// 添加/移除星标
            switch (vm.detail.baseInfo.starred) {
                case 0:
                case '0':
                // 添加星标
                    {
                        Api.Star.Add(vm.info).$promise.then(function(data) {
                            if (code == data.statusCode) {
                                vm.detail.baseInfo.starred = 1;
                            }
                        });
                        break;
                    }
                case 1:
                case '1':
                // 移除星标
                    {
                        Api.Star.Delete(vm.info).$promise.then(function(data) {
                            if (code == data.statusCode) {
                                vm.detail.baseInfo.starred = 0;
                            }
                        });
                        break;
                    }
            }
        }
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
        vm.MessageModel = function openModel(title, info, callback) {
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'MessageModel',
                controller: 'MessageModelCtrl',
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
        $scope.$on('$stateChangeSuccess', function() {
            if (vm.info.groupID == -2) {
                vm.trash = true;
            } else {
                vm.trash = false;
            }
        })
    }

})();
