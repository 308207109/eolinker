(function() {
    /* 数据库侧边栏指令 */
    angular.module('eolinker').directive('databaseSidebar', ["$window", function($window, EVENT) {
        return {
            restrict: 'AE',
            templateUrl: 'app/page/database/sidebar/sidebar.html',
            // replace:true,
            scope: {
                isShrink: '=' // 是否收缩
            },
            controller: databaseSidebarCtroller,
            controllerAs: 'databaseSidebarCtrl'
        }
    }])

    databaseSidebarCtroller.$inject = ['$scope', 'Api', '$state', 'CODE', '$uibModal', '$rootScope'];

    function databaseSidebarCtroller($scope, Api, $state, CODE, $uibModal, $rootScope) {
        var vm = this;
        var code = CODE.SUCCESS;
        vm.info = {
            dbID: $state.params.dbID,
            tableID: $state.params.tableID
        }
        vm.query = [];

        function init() { // 初始化数据库侧边栏
            Api.Table.Query(vm.info).$promise.then(function(data) {
                if (code == data.statusCode) {
                    vm.query = data.tableList;
                    if (!vm.info.tableID && vm.query.length > 0) {
                        vm.info.tableID = vm.query[0].tableID;
                        vm.query[0].isClick = true;
                        window.document.title = vm.query[0].tableName + ' - ' + $rootScope.user.title;
                        $state.go('database.list', { 'dbID': vm.info.dbID, 'tableID': vm.info.tableID });
                    } else {
                        angular.forEach(vm.query, function(val, key) {
                            if (val.tableID == vm.info.tableID) {
                                val.isClick = true;
                                window.document.title = val.tableName + ' - ' + $rootScope.user.title;
                            }
                        })
                    }

                }
            })
        }
        init();
        vm.click = function(tableID, query) { // 选中表
            angular.forEach(vm.query, function(val, key) {
                val.isClick = false;
            });
            query.isClick = true;
            vm.info.tableID = tableID;
            window.document.title = query.tableName +  ' - ' + $rootScope.user.title;
            $state.go('database.list', { 'dbID': vm.info.dbID, 'tableID': tableID });
        }
        vm.edit = function(val) { // 修改/新增表
            var title = '';
            if (val) {
                title = '修改表';
            } else {
                title = '新增表';
            }
            vm.TableModel(title, val, vm.info.dbID, function(info) {
                if (info) {
                    if (val) {
                        Api.Table.Update(info).$promise.then(function(data) {
                            if (code == data.statusCode) {
                                vm.InfoModel(title + '成功', 'success');
                                angular.forEach(vm.query, function(val, key) {
                                    if (val.tableID == info.tableID) {
                                        val.tableName = info.tableName;
                                        val.tableDescription = info.tableDesc;
                                    }
                                });
                            }
                        });
                    } else {
                        Api.Table.Add(info).$promise.then(function(data) {
                            if (code == data.statusCode) {
                                vm.InfoModel(title + '成功', 'success');
                                init();
                            }
                        });
                    }
                }
            });
        }
        vm.delete = function(tableID, index) { // 删除表
            vm.EnsureModel('删除表', false, '删除表后，该操作无法撤销，确认删除？', {}, function(data) {
                if (data) {
                    Api.Table.Delete({ tableID: tableID }).$promise.then(function(data) {
                        if (data.statusCode == code) {
                            vm.query.splice(index, 1);
                            vm.InfoModel('表删除成功', 'success');
                            if (vm.query.length > 0) {
                                vm.click(vm.query[0].tableID, vm.query[0]);
                            } else {
                                vm.info.tableID = null;
                                $state.go('database.list', { 'dbID': vm.info.dbID, 'tableID': null });
                            }
                        }
                    })
                }
                vm.info.isFunction = false;
            });
        }

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
        vm.TableModel = function openModel(title, info, dbID, callback) {
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'TableModel',
                controller: 'TableModelCtrl',
                resolve: {
                    title: function() {
                        return title;
                    },
                    info: function() {
                        return info;
                    },
                    dbID: function() {
                        return dbID;
                    }
                }
            });
            modalInstance.result.then(callback);
        }
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
    }

})();
