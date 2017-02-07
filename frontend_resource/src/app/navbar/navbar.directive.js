(function() {
    /* 导航栏指令 */
    angular.module('eolinker').directive('eoNavbar', ['$timeout', "$window", function($timeout, $window, EVENT) {
        return {
            restrict: 'AE',
            templateUrl: 'app/navbar/navbar.html',
            // replace:true,
            controller: navbar,
            controllerAs: 'navbarCtrl'
        }
    }])

    navbar.$inject = ['$scope', 'Api', '$state', '$window', 'CODE', '$uibModal', '$timeout'];

    function navbar($scope, Api, $state, $window, CODE, $uibModal, $timeout) {

        var vm = this;
        var code = CODE.SUCCESS;
        vm.check = {
            hadLogin: false,
            isProject: false,
            currentState: '0'
        }

        function initState() {// 根据路由更新视图
            if (/index/.test($state.current.name)) {
                vm.check.isProject = false;
                vm.check.currentState = '0';
            } else if (/register/.test($state.current.name)) {
                vm.check.isProject = false;
                vm.check.currentState = '1';
            } else if (/(home)|(project)|(database)/.test($state.current.name)) {
                if (/(project)|(database)/.test($state.current.name)) {
                    vm.check.isProject = true;
                } else {
                    vm.check.isProject = false;
                }
                vm.check.currentState = '2';
            } else if (/guide/.test($state.current.name)) {
                vm.check.isProject = false;
                vm.check.currentState = '3';
            } else {
                vm.check.isProject = false;
                vm.check.currentState = '-1';
            }
        }

        function init() {// 初始化navbar
            if (!window.localStorage['USER']) {
                Api.User.Info().$promise.then(function(data) {
                    if (data.statusCode == code) {
                        vm.info = data.userInfo;
                        vm.check.hadLogin = true;
                        window.localStorage.setItem('USER', JSON.stringify(vm.info));
                    } else {
                        vm.check.hadLogin = false;
                    }
                });
            } else {
                try {
                    Api.Logintype.Check().$promise.then(function(data) {
                        if (data.statusCode == code) {
                            vm.check.hadLogin = true;
                            vm.info = JSON.parse(window.localStorage['USER']);
                        } else {
                            vm.check.hadLogin = false;
                        }
                    });
                } catch (e) {
                    vm.info = {
                        unreadMsgNum: 0,
                        userNickName: '未知',
                        userName: '未知'
                    }
                }
            }
            initState();
        }
        init();
        
        vm.goProject = function() {// 跳转至项目列表页面
            $state.go('home.project.api');
        }

        vm.tips = function() {// 打开技巧提示弹框
            vm.TipsModel();
        }

        vm.logout = function() {// 退出登录
            Api.Login.Out().$promise.then(function(data) {
                if (data.statusCode == code) {
                    if (/(project)|(home)|(database)/.test(window.location.href)) {
                        $state.go('index');
                    } else {
                        vm.check.hadLogin = false;
                        $state.reload();
                    }
                    window.localStorage.removeItem('PROJECT');
                    window.localStorage.removeItem('APIDETAIL');
                    window.localStorage.removeItem('USER');
                }
            })
        }

        vm.update = function() {// 版本更新
            var title = '版本更新'
            vm.UpdateModel(title);
        }

        $scope.$on('$newsRead', function(e, attr) {// 当消息状态变化时更新视图
            if (vm.info.unreadMsgNum > 0) {
                vm.info.unreadMsgNum--;
                window.localStorage.setItem('USER', JSON.stringify(vm.info));
            }
        })

        $scope.$on('$newsClean', function(e, attr) {// 当消息清空时更新视图
            vm.info.unreadMsgNum = 0;
            window.localStorage.setItem('USER', JSON.stringify(vm.info));
        })

        $scope.$on('$changeUSER', function(e, attr) {// 当用户昵称改变时更新视图
            vm.info.userNickName = attr;
        })

        $scope.$on('$stateChangeSuccess', function() {// 当路由改变时更新视图
            if (vm.check.currentState != '3') {
                if (!window.localStorage['USER']) {
                    Api.User.Info().$promise.then(function(data) {
                        if (data.statusCode == code) {
                            vm.info = data.userInfo;
                            vm.check.hadLogin = true;
                            window.localStorage.setItem('USER', JSON.stringify(vm.info));
                        } else {
                            vm.check.hadLogin = false;
                        }
                    });
                } else {
                    try {
                        Api.Logintype.Check().$promise.then(function(data) {
                            if (data.statusCode == code) {
                                vm.check.hadLogin = true;
                                vm.info = JSON.parse(window.localStorage['USER']);
                            } else {
                                vm.check.hadLogin = false;
                            }
                        });
                        if (vm.check.hadLogin) {
                            Api.News.UnReadNum().$promise.then(function(data) {
                                if (data.statusCode == code) {
                                    if (vm.info.unreadMsgNum != data.unreadMsgNum) {
                                        vm.info.unreadMsgNum = data.unreadMsgNum;
                                        window.localStorage.setItem('USER', JSON.stringify(vm.info));
                                    }
                                } else {
                                    vm.info.unreadMsgNum = 0;
                                }
                            });
                        }
                    } catch (e) {
                        vm.info = {
                            unreadMsgNum: 0,
                            userNickName: '未知',
                            loginName: '未知'
                        }
                    }
                }
            }
            initState();
        })


        // 弹窗专用
        vm.TipsModel = function openModel(callback) {
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'TipsModel',
                controller: 'TipsModelCtrl',
                resolve: {}
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
        vm.UpdateModel = function openModel(title, info, callback) {
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'UpdateModel',
                controller: 'UpdateModelCtrl',
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
