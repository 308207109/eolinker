(function() {
    /* 回收站指令 */
    angular.module('eolinker').directive('projectApiTrash', ['$timeout', "$window", function($timeout, $window, EVENT) {
        return {
            restrict: 'AE',
            templateUrl: 'app/page/project/content/api/trash/trash.html',
            // replace:true,
            controller: projectApiTrashCtroller,
            controllerAs: 'projectApiTrashCtrl'
        }
    }])

    projectApiTrashCtroller.$inject = ['$scope', 'Api', '$state', 'CODE', '$uibModal', '$timeout'];

    function projectApiTrashCtroller($scope, Api, $state, CODE, $uibModal, $timeout) {
        var vm = this;
        var code = CODE.SUCCESS;
        vm.info = {
            projectID: $state.params.projectID,
            groupID: $state.params.groupID,
            orderBy: 1,
            asc: 1
        }
        vm.projectDetail = {};
        vm.sortInfo = {
            name: false,
            time: true,
            starAsc: true,
            nameAsc: true,
            timeAsc: false
        }
        vm.query = [];
        vm.loadingIsEnd = true;

        function init() { // 初始化接口回收站页面
            vm.projectDetail.apiLength = 0;
            vm.loadingIsEnd = false;
            Api.Trash.Query(vm.info).$promise.then(function(data) {
                vm.loadingIsEnd = true;
                if (code == data.statusCode) {
                    vm.query = data.apiList;
                    vm.projectDetail.apiLength = vm.query.length;
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
                } else {
                    vm.query = [];
                }
            })
        }
        var timer = $timeout(function() {
            init();
        });
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
                //添加星标
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
                //移除星标
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
        vm.recover = function(apiID, index) {// 从回收站中恢复接口
            vm.info.isFunction = true;
            Api.Trash.Recover({ apiID: apiID }).$promise.then(function(data) {
                if (data.statusCode == code) {
                    vm.query.splice(index, 1);
                }
                vm.info.isFunction = false;
            })
        }
        vm.delete = function(apiID, index) {// 彻底删除接口
            vm.info.isFunction = true;
            vm.EnsureModel('永久性删除Api', false, '此操作无法恢复，确认删除？', function(data) {
                if (data) {
                    Api.Trash.Delete({ apiID: apiID }).$promise.then(function(data) {
                        if (data.statusCode == code) {
                            vm.query.splice(index, 1);
                            vm.InfoModel('Api删除成功', 'success');
                        } else {
                            vm.InfoModel('删除失败，请稍候再试或到论坛提交bug', 'error');
                        }
                    })
                }
                vm.info.isFunction = false;
            });
        }
        vm.clean = function() {// 清空回收站
            vm.EnsureModel('清空回收站', false, '此操作无法恢复，确认删除？', function(data) {
                if (data) {
                    Api.Trash.Clean({ projectID: vm.info.projectID }).$promise.then(function(data) {
                        if (data.statusCode == code) {
                            vm.InfoModel('回收站清空成功', 'success');
                            init();
                        }
                    })
                }
            });
        }
        vm.enterApi = function(apiID) {// 跳转接口详情页面
            if (!vm.info.isFunction) {
                $state.go('project.api.detail', { 'projectID': vm.info.projectID, 'groupID': vm.info.groupID, 'apiID': apiID });
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
    }

})();
