(function() {
    /* 接口列表指令 */
    angular.module('eolinker').directive('projectApiList', ['$timeout', "$window", function($timeout, $window, EVENT) {
        return {
            restrict: 'AE',
            templateUrl: 'app/page/project/content/api/list/list.html',
            // replace:true,
            controller: projectApiListCtroller,
            controllerAs: 'projectApiListCtrl'
        }
    }])

    projectApiListCtroller.$inject = ['$scope', 'Api', '$state', 'CODE', '$uibModal', '$rootScope', '$timeout', 'GroupService'];

    function projectApiListCtroller($scope, Api, $state, CODE, $uibModal, $rootScope, $timeout, GroupService) {
        var vm = this;
        var code = CODE.SUCCESS;
        vm.info = {
            projectID: $state.params.projectID,
            groupID: $state.params.groupID,
            childGroupID: $state.params.childGroupID,
            tips: $state.params.search,
            orderBy: 1,
            asc: 1
        }
        vm.sortInfo = {
            name: false,
            time: true,
            starAsc: true,
            nameAsc: true,
            timeAsc: false
        }

        vm.query = [];
        vm.envInfo = {
            envURI: '',
            isShow: false
        }
        vm.loadingIsEnd = true;

        function init() { // 初始化接口列表页面
            vm.loadingIsEnd = false;

            if (vm.info.tips) {
                Api.Api.Search(vm.info).$promise.then(function(data) {
                    vm.loadingIsEnd = true;
                    if (code == data.statusCode) {
                        vm.query = data.apiList;
                        angular.forEach(vm.query, function(val, key) {
                            switch (val.apiRequestType) {
                                case 0:
                                case '0':
                                    val.type = 'POST';
                                    break;
                                case 1:
                                case '1':
                                    val.type = 'GET';
                                    break;
                                case 2:
                                case '2':
                                    val.type = 'PUT';
                                    break;
                                case 3:
                                case '3':
                                    val.type = 'DELETE';
                                    break;
                                case 4:
                                case '4':
                                    val.type = 'HEAD';
                                    break;
                                case 5:
                                case '5':
                                    val.type = 'OPTS';
                                    break;
                                case 6:
                                case '6':
                                    val.type = 'PATCH';
                                    break;
                            }
                        })
                    }
                })
            } else if (vm.info.groupID == -1) {
                Api.Api.All(vm.info).$promise.then(function(data) {
                    vm.loadingIsEnd = true;
                    if (code == data.statusCode) {
                        vm.query = data.apiList;
                        angular.forEach(vm.query, function(val, key) {
                            switch (val.apiRequestType) {
                                case 0:
                                case '0':
                                    val.type = 'POST';
                                    break;
                                case 1:
                                case '1':
                                    val.type = 'GET';
                                    break;
                                case 2:
                                case '2':
                                    val.type = 'PUT';
                                    break;
                                case 3:
                                case '3':
                                    val.type = 'DELETE';
                                    break;
                                case 4:
                                case '4':
                                    val.type = 'HEAD';
                                    break;
                                case 5:
                                case '5':
                                    val.type = 'OPTS';
                                    break;
                                case 6:
                                case '6':
                                    val.type = 'PATCH';
                                    break;
                            }
                        })
                    }
                })
            } else {
                Api.Api.Query({ groupID: vm.info.childGroupID ? vm.info.childGroupID : vm.info.groupID, orderBy: vm.info.orderBy, asc: vm.info.asc }).$promise.then(function(data) {
                    vm.loadingIsEnd = true;
                    if (code == data.statusCode) {
                        vm.query = data.apiList;
                        angular.forEach(vm.query, function(val, key) {
                            switch (val.apiRequestType) {
                                case 0:
                                case '0':
                                    val.type = 'POST';
                                    break;
                                case 1:
                                case '1':
                                    val.type = 'GET';
                                    break;
                                case 2:
                                case '2':
                                    val.type = 'PUT';
                                    break;
                                case 3:
                                case '3':
                                    val.type = 'DELETE';
                                    break;
                                case 4:
                                case '4':
                                    val.type = 'HEAD';
                                    break;
                                case 5:
                                case '5':
                                    val.type = 'OPTS';
                                    break;
                                case 6:
                                case '6':
                                    val.type = 'PATCH';
                                    break;
                            }
                        })
                    }
                })
            }
        }
        var timer = $timeout(function() {
            init();
        });

        vm.edit = function(query) {// 编辑/新增接口
            vm.info.isFunction = true;
            var apiGroup = GroupService.get(0);
            if (apiGroup == null || apiGroup.statusCode == CODE.EMPTY) {
                vm.InfoModel('请先建立分组！', 'error');
            } else if (apiGroup.statusCode == code) {
                if (!query) {
                    $state.go('project.api.edit', { 'projectID': vm.info.projectID, 'groupID': vm.info.groupID, 'childGroupID': vm.info.childGroupID });
                } else {
                    $state.go('project.api.edit', { 'projectID': vm.info.projectID, 'groupID': vm.info.groupID, 'childGroupID': vm.info.childGroupID, 'apiID': query.apiID })
                }
            }
        }
        vm.delete = function(apiID, index) {// 删除接口
            vm.info.isFunction = true;
            vm.EnsureModel('删除Api', false, '确认删除', function(data) {
                if (data) {
                    Api.Api.Delete({ apiID: apiID }).$promise.then(function(data) {
                        if (data.statusCode == code) {
                            vm.query.splice(index, 1);
                            vm.InfoModel('Api删除成功，已移入回收站', 'success');
                        }
                    })
                }
                vm.info.isFunction = false;
            });
        }
        vm.sort = function(val) {// 排序
            switch (val) {
                case 0:
                // 按星标排序
                    {
                        if (vm.sortInfo.starAsc) {
                            vm.info.asc = 1;
                        } else {
                            vm.info.asc = 0;
                        }
                        vm.sortInfo.starAsc = !vm.sortInfo.starAsc;
                        vm.sortInfo.name = false;
                        vm.sortInfo.time = false;
                        vm.info.orderBy = 2;
                        init();
                        break;
                    }
                case 1:
                // 按名称排序
                    {
                        if (vm.sortInfo.nameAsc) {
                            vm.info.asc = 1;
                        } else {
                            vm.info.asc = 0;
                        }
                        vm.sortInfo.nameAsc = !vm.sortInfo.nameAsc;
                        vm.sortInfo.time = false;
                        vm.sortInfo.name = true;
                        vm.info.orderBy = 0;
                        init();
                        break;
                    }
                case 2:
                // 按时间排序
                    {
                        if (vm.sortInfo.timeAsc) {
                            vm.info.asc = 1;
                        } else {
                            vm.info.asc = 0;
                        }
                        vm.info.orderBy = 1;
                        vm.sortInfo.name = false;
                        vm.sortInfo.time = true;
                        vm.sortInfo.timeAsc = !vm.sortInfo.timeAsc;
                        init();
                        break;
                    }
            }
        }
        vm.storage = function(query) {// 添加/移除星标
            vm.info.isFunction = true;
            switch (query.starred) {
                case 0:
                    {
                        Api.Star.Add({ 'apiID': query.apiID }).$promise.then(function(data) {
                            if (code == data.statusCode) {
                                query.starred = 1;
                            }
                            vm.info.isFunction = false;
                        });
                        break;
                    }
                case 1:
                    {
                        Api.Star.Delete({ 'apiID': query.apiID }).$promise.then(function(data) {
                            if (code == data.statusCode) {
                                query.starred = 0;
                            }
                            vm.info.isFunction = false;
                        });
                        break;
                    }
            }
        }

        vm.team = function(apiID, index) {// 打开协作管理弹窗
            vm.TeamModel('协作成员', function(data) {});
        }

        vm.enterApi = function(apiID) {// 跳转接口详情页面
            if (!vm.info.isFunction) {
                $state.go('project.api.detail', { 'projectID': vm.info.projectID, 'groupID': vm.info.groupID, 'childGroupID': vm.info.childGroupID, 'apiID': apiID });
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
        vm.TeamModel = function openModel(title, callback) {
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'TeamModel',
                controller: 'TeamModelCtrl',
                resolve: {
                    title: function() {
                        return title;
                    }
                }
            });
            modalInstance.result.then(callback);
        }

    }

})();
