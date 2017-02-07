(function() {
    /* 账户管理指令 */
    angular.module('eolinker').directive('homeUser', ['$timeout', "$window", function($timeout, $window, EVENT) {
        return {
            restrict: 'AE',
            templateUrl: 'app/page/home/content/user/user.html',
            // replace:true,
            controller: homeUserCtroller,
            controllerAs: 'homeUserCtrl'
        }
    }])

    homeUserCtroller.$inject = ['$scope', 'Api', '$state', 'CODE', '$uibModal', 'md5', '$timeout'];

    function homeUserCtroller($scope, Api, $state, CODE, $uibModal, md5, $timeout) {
        var vm = this;
        var code = CODE.SUCCESS;
        vm.info = {};
        vm.basic = {
            nickName: '',
            userName: ''
        };

        vm.userInfo = {};

        vm.loadingIsEnd = true;
        window.document.title = '账户管理 - eolinker开源版';

        function init() { // 初始化账户管理页面
            vm.loadingIsEnd = false;

            vm.info = {
                oldPassword: '',
                newPassword: '',
                confirmPassword: ''
            }
            Api.User.Info().$promise.then(function(data) {
                vm.loadingIsEnd = true;
                vm.basic = {
                    userName: data.userInfo.userName,
                    nickName: data.userInfo.userNickName
                }
            })
        }
        $timeout(function() {
            init();
        });

        vm.confirm = function() {
            if ($scope.basicForm.$valid) {
                Api.User.Nickname({ nickName: vm.basic.nickName }).$promise.then(function(data) {
                    if (data.statusCode == code || data.statusCode == '130009') {
                        if (data.statusCode == code) {
                            vm.userInfo.userNickName = vm.basic.nickName;
                            window.localStorage.setItem('USER', JSON.stringify(vm.userInfo));
                            // 向上传递事件，修改用户昵称
                            $scope.$emit('$changeUSER', vm.userInfo.userNickName);
                        }
                        vm.InfoModel('修改成功', 'success');
                    }
                })
            }
        }
        vm.oldChange = function() { // 旧密码输入框内容改变时移除error样式
            vm.info.error = false;
        }
        vm.changePassword = function() {// 修改密码
            if ($scope.passwordForm.$valid) {
                var info = {
                    oldPassword: md5.createHash(vm.info.oldPassword),
                    newPassword: md5.createHash(vm.info.newPassword)
                };
                Api.User.Password(info).$promise.then(function(data) {
                    if (data.statusCode == code || data.statusCode == '130002') {
                        init();
                        $scope.passwordForm.password.$dirty = false;
                        $scope.passwordForm.confirmPassword.$dirty = false;
                        vm.InfoModel('修改成功', 'success');
                    } else if (data.statusCode == '130006') {
                        vm.info.error = true;
                        vm.InfoModel('旧密码错误', 'error');
                    }
                })
            }
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
    }

})();
