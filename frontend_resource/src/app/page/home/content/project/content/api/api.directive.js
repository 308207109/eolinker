(function() {
    /* 项目列表指令 */
    angular.module('eolinker').directive('homeProjectApi', ['$timeout', "$window", function($timeout, $window, EVENT) {
        return {
            restrict: 'AE',
            templateUrl: 'app/page/home/content/project/content/api/api.html',
            // replace:true,
            controller: homeProjectApiCtroller,
            controllerAs: 'homeProjectApiCtrl'
        }
    }])

    homeProjectApiCtroller.$inject = ['$scope', 'Api', '$state', 'CODE', '$uibModal', '$rootScope', '$timeout'];

    function homeProjectApiCtroller($scope, Api, $state, CODE, $uibModal, $rootScope, $timeout) {
        var vm = this;
        var code = CODE.SUCCESS;
        vm.info = {
            projectName: '',
            projectType: -1,
            isFunction: false
        };
        vm.query = [];
        window.document.title = '项目列表 - eolinker开源版';
        vm.loadingIsEnd = true;

        function init() { // 初始化项目列表页面
            vm.loadingIsEnd = false;
            Api.Project.Query(vm.info).$promise.then(function(data) {
                vm.loadingIsEnd = true;
                if (data.statusCode == code) {
                    vm.query = data.projectList;
                    angular.forEach(vm.query, function(val, key) {
                        switch (val.projectType) {
                            case 0:
                            case '0':
                                val.type = 'Web';
                                break;
                            case 1:
                            case '1':
                                val.type = 'App';
                                break;
                            case 2:
                            case '2':
                                val.type = 'PC';
                                break;
                            case 3:
                            case '3':
                                val.type = '其他';
                                break;
                        }
                    })
                    window.localStorage.setItem('PROJECT', JSON.stringify(data.projectList));
                }
            })
        }
        var timer = $timeout(function() {
            init();
        });
        vm.importFile = function() { // “导入项目按钮”，打开导入项目弹窗
            vm.ImportModel('导入项目', function(data) {
                if (data) {
                    vm.InfoModel('导入项目成功', 'success');
                    init();
                }
            });
        }
        vm.edit = function(data) { // 修改/新增项目
            var title = '';
            if (data) {
                title = '修改项目';
                vm.info.isFunction = true;
            } else {
                title = '新增项目';
            }
            vm.ProjectModel(title, data, function(data) {
                if (data) {
                    vm.InfoModel(title + '成功', 'success');
                    init();
                }
                vm.info.isFunction = false;
            });
        }
        vm.delete = function(projectID, index) { // 删除项目
            vm.info.isFunction = true;
            vm.EnsureModel('删除项目', true, '确认删除？', function(data) {
                if (data) {
                    Api.Project.Delete({ 'projectID': projectID }).$promise.then(function(data) {
                        if (data.statusCode == code) {
                            vm.query.splice(index, 1);
                            vm.InfoModel('项目删除成功', 'success');
                        }
                    })
                }
                vm.info.isFunction = false;
            });
        }
        vm.enterProject = function(projectID) { // 跳转api列表页面
            if (!vm.info.isFunction) {
                Api.Project.Detail({ projectID: projectID }).$promise.then(function(data) {
                    if (code == data.statusCode) {
                        window.localStorage.setItem('PROJECT', JSON.stringify(data));
                        $state.go('project.api.list', { 'projectID': projectID, 'groupID': -1 });
                    }
                })

            }
        }
        $scope.$on('$destroy', function() { // 页面跳转触发事件
            if (timer) {
                $timeout.cancel(timer);
            }
        });

        //弹窗引用
        vm.ImportModel = function openModel(title, callback) {
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'ImportModel',
                controller: 'ImportModelCtrl',
                resolve: {
                    title: function() {
                        return title;
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
        vm.ProjectModel = function openModel(title, info, callback) {
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'ProjectModel',
                controller: 'ProjectModelCtrl',
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
