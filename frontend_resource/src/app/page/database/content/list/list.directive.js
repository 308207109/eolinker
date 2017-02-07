(function() {
    /* 数据库列表指令 */
    angular.module('eolinker').directive('databaseList', ["$window", function($window, EVENT) {
        return {
            restrict: 'AE',
            templateUrl: 'app/page/database/content/list/list.html',
            // replace:true,
            controller: databaseListCtroller,
            controllerAs: 'databaseListCtrl'
        }
    }])

    databaseListCtroller.$inject = ['$timeout', '$scope', 'Api', '$state', 'CODE', '$uibModal'];

    function databaseListCtroller($timeout, $scope, Api, $state, CODE, $uibModal) {
        var vm = this;
        var code = CODE.SUCCESS;
        vm.info = {
            dbID: $state.params.dbID,
            tableID: $state.params.tableID
        }
        vm.loadingIsEnd = true;
        var init = function() { // 初始化字段列表页面
            vm.loadingIsEnd = false;
            Api.Field.Query(vm.info).$promise.then(function(data) {
                vm.loadingIsEnd = true;
                if (code == data.statusCode) {
                    vm.query = data.fieldList;
                    vm.queryLength = vm.query.length;
                } else {
                    vm.queryLength = 0;
                }
            })
        }
        var timer = $timeout(function() {
            init();
        });
        vm.edit = function(data) { // 修改/新增字段
            var title = '';
            if (data) {
                title = '修改字段';
                vm.FieldModel(title, data, function(data) {
                    if (data) {
                        vm.InfoModel(title + '成功', 'success');
                        init();
                    }
                });
            } else {
                Api.Table.Query(vm.info).$promise.then(function(data) {
                    if (data.statusCode != code) {
                        vm.InfoModel('请先建立表！', 'error');
                    } else {
                        title = '新增字段';
                        data.tableID = vm.info.tableID;
                        vm.FieldModel(title, data, function(data) {
                            if (data) {
                                vm.InfoModel(title + '成功', 'success');
                            }
                            init();
                        });
                    }
                })
            }
        }

        vm.delete = function(fieldID, index) {// 删除字段
            vm.info.isFunction = true;
            vm.EnsureModel('删除字段', false, '确认删除', {}, function(data) {
                if (data) {
                    Api.Field.Delete({ fieldID: fieldID }).$promise.then(function(data) {
                        if (data.statusCode == code) {
                            vm.query.splice(index, 1);
                            vm.InfoModel('字段删除成功！', 'success');
                        }
                    })
                }
                vm.info.isFunction = false;
            });
        }
        vm.showDesc = function(info) { // 打开字段描述弹窗
            vm.MessageModel(info.fieldName + '-字段描述', info.fieldDescription, function(data) {});
        }


        $scope.$on('$destroy', function() {// 页面跳转触发事件
            if (timer) {
                $timeout.cancel(timer);
            }
        });

        //弹窗引用
        vm.EnsureModel = function openModel(title, necessity, info, btn, callback) {
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
                    },
                    btn: function() {
                        return btn;
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
        vm.FieldModel = function openModel(title, info, callback) {
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'FieldModel',
                controller: 'FieldModelCtrl',
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

})();
