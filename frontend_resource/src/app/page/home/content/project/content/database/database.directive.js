(function() {
    /* 数据库列表指令 */
    angular.module('eolinker').directive('homeProjectDatabase', ['$timeout', "$window", function($timeout, $window, EVENT) {
        return {
            restrict: 'AE',
            templateUrl: 'app/page/home/content/project/content/database/database.html',
            // replace:true,
            controller: homeProjectDatabaseCtroller,
            controllerAs: 'homeProjectDatabaseCtrl'
        }
    }])

    homeProjectDatabaseCtroller.$inject = ['$scope', 'Api', '$state', 'CODE', '$uibModal', '$rootScope', '$timeout'];

    function homeProjectDatabaseCtroller($scope, Api, $state, CODE, $uibModal, $rootScope, $timeout) {
        var vm = this;
        var code = CODE.SUCCESS;
        vm.info = {
            dbName: '',
            dbType: -1,
            isFunction: false
        };
        vm.query = [];
        vm.loadingIsEnd = true;

        function init() { // 初始化数据库列表页面
            vm.loadingIsEnd = false;
            Api.Database.Query(vm.info).$promise.then(function(data) {
                vm.loadingIsEnd = true;
                if (data.statusCode == code) {
                    vm.query = data.databaseList;
                }
            })
        }
        var timer = $timeout(function() {
            init();
        });
        vm.edit = function(data) { // 修改/新增数据库
            var title = '';
            if (data) {
                title = '修改数据库';
                vm.info.isFunction = true;
            } else {
                title = '新增数据库';
            }
            vm.DatabaseModel(title, data, function(data) {
                if (data) {
                    vm.InfoModel(title + '成功', 'success');
                    init();
                }
                vm.info.isFunction = false;
            });
        }
        vm.delete = function(dbID, index) { // 删除数据库
            vm.info.isFunction = true;
            vm.EnsureModel('删除数据库', true, '确认删除？', function(data) {
                if (data) {
                    Api.Database.Delete({ 'dbID': dbID }).$promise.then(function(data) {
                        if (data.statusCode == code) {
                            vm.query.splice(index, 1);
                            vm.InfoModel('数据库删除成功', 'success');
                        }
                    })
                }
                vm.info.isFunction = false;
            });
        }
        vm.enterDatabase = function(dbID) { // 跳转字段列表页面
            if (!vm.info.isFunction) {
                $state.go('database.list', { dbID: dbID });
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
        vm.DatabaseModel = function openModel(title, info, callback) {
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'DatabaseModel',
                controller: 'DatabaseModelCtrl',
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
