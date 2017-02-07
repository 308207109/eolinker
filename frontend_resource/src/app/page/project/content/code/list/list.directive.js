(function() {
    /* 状态码列表指令 */
    angular.module('eolinker').directive('projectCodeList', ['$timeout', "$window", function($timeout, $window, EVENT) {
        return {
            restrict: 'AE',
            templateUrl: 'app/page/project/content/code/list/list.html',
            // replace:true,
            controller: projectCodeListCtroller,
            controllerAs: 'projectCodeListCtrl'
        }
    }])

    projectCodeListCtroller.$inject = ['$timeout', '$scope', 'Api', '$state', 'CODE', '$uibModal', 'GroupService'];

    function projectCodeListCtroller($timeout, $scope, Api, $state, CODE, $uibModal, GroupService) {
        var vm = this;
        var code = CODE.SUCCESS;
        vm.info = {
                projectID: $state.params.projectID,
                groupID: $state.params.groupID,
                childGroupID: $state.params.childGroupID,
                tips: $state.params.search,
                orderBy: 0,
                asc: 0
            }
        vm.projectDetail = {
            codeLength: 0
        }
        vm.sortInfo = {
            name: true,
            time: false,
            starAsc: true,
            nameAsc: true,
            timeAsc: true
        }
        vm.query = [];
        vm.loadingIsEnd = true;

        function init() {// 初始化状态码列表页面
            vm.loadingIsEnd = false;
            if (vm.info.tips) {
                Api.Code.Search(vm.info).$promise.then(function(data) {
                    vm.loadingIsEnd = true;
                    if (code == data.statusCode) {
                        vm.query = data.codeList;
                        vm.projectDetail.codeLength = vm.query.length;
                    } else {
                        vm.projectDetail.codeLength = 0;
                    }
                })
            } else if (vm.info.groupID == -1) {
                vm.loadingIsEnd = false;
                Api.Code.All({ projectID: vm.info.projectID }).$promise.then(function(data) {
                    vm.loadingIsEnd = true;
                    if (code == data.statusCode) {
                        vm.query = data.codeList;
                        vm.projectDetail.codeLength = vm.query.length;
                    } else {
                        vm.projectDetail.codeLength = 0;
                    }
                })
            } else {
                vm.loadingIsEnd = false;
                Api.Code.Query({ groupID: vm.info.childGroupID ? vm.info.childGroupID : vm.info.groupID }).$promise.then(function(data) {
                    vm.loadingIsEnd = true;
                    angular.element(document.getElementById('loading_js')).addClass('hidden');
                    if (code == data.statusCode) {
                        vm.query = data.codeList;
                        vm.projectDetail.codeLength = vm.query.length;
                    } else {
                        vm.projectDetail.codeLength = 0;
                    }
                })
            }
        }
        var timer = $timeout(function() {
            init();
        });
        vm.edit = function(data, groupID) {// 修改/新增状态码
            var title = '';
            var codeGroup = GroupService.get(1);
            if (codeGroup == null || codeGroup.statusCode == '180001') {
                vm.InfoModel('请先建立分组！', 'error');
            } else if (codeGroup.statusCode == code) {
                if (data) {
                    title = '修改状态码';
                    data.projectID = vm.info.projectID;
                    data.childGroupID = vm.info.childGroupID;
                    vm.CodeModel(title, data, function(data) {
                        if (data) {
                            vm.InfoModel(title + '成功', 'success');
                            init();
                        }
                    });
                } else {
                    title = '新增状态码';
                    data = {
                        projectID: vm.info.projectID,
                        groupID: vm.info.groupID,
                        childGroupID: vm.info.childGroupID
                    }
                    vm.CodeModel(title, data, function(data) {
                        if (data) {
                            vm.InfoModel(title + '成功', 'success');
                        }
                        init();
                    });
                }
            }
        }
        
        vm.delete = function(codeID, index) {// 删除状态码
            vm.EnsureModel('删除状态码', false, '确认删除', function(data) {
                if (data) {
                    Api.Code.Delete({ codeID: codeID }).$promise.then(function(data) {
                        if (data.statusCode == code) {
                            vm.query.splice(index, 1);
                            vm.InfoModel('状态码删除成功', 'success');
                        }
                    })
                }
            });
        }
        vm.team = function(apiID, index) {// 打开协作管理弹窗
            vm.TeamModel('协作成员', '确认删除', function(data) {
            });
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
        vm.CodeModel = function openModel(title, info, callback) {
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'CodeModel',
                controller: 'CodeModelCtrl',
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
        vm.TeamModel = function openModel(title, info, callback) {
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'TeamModel',
                controller: 'TeamModelCtrl',
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
