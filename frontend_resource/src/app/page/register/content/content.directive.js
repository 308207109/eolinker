(function() {
    /* 注册指令 */
    angular.module('eolinker').directive('registerContent', ['$timeout', "$window", function($timeout, $window, EVENT) {
        return {
            restrict: 'AE',
            templateUrl: 'app/page/register/content/content.html',
            // replace:true,
            controller: registerContentCtroller,
            controllerAs: 'registerContentCtrl'
        }
    }])

    registerContentCtroller.$inject = ['$scope', '$timeout', 'Api', '$state', 'CODE', 'md5', '$uibModal', '$rootScope'];

    function registerContentCtroller($scope, $timeout, Api, $state, CODE, md5, $uibModal, $rootScope) {

        var vm = this;
        var code = CODE.SUCCESS;
        vm.info = {
            userName: '',
            userPassword: '',
        }
        vm.template = {
            password: '',
            comfirmPassword: '',
            submited: false
        }
        vm.alert = {
            user: '4~64位非纯数字，英文数字下划线组合，只能以英文开头'
        }

        function init() {// 初始化注册页面
            vm.projectLogo = 'app/assets/images/eolinker_os.png';
        }
        init();

        vm.textChange = function() {// 输入改变时判断是否用户名重复
            var info = {
                userName: ''
            }
            if ($scope.registerForm.username.$valid) {
                info.userName = vm.info.userName;
            }
            if (info.userName != '') {
                Api.Register.Check(info).$promise.then(function(data) {
                    if (data.statusCode == code) {
                        vm.unavailable = false;
                        vm.alert.user = '4~64位非纯数字，英文数字下划线组合，只能以英文开头';
                    } else if (data.statusCode == '130005') {
                        vm.unavailable = true;
                        vm.alert.user = '用户名已存在';
                    }
                })
            } else {
                vm.unavailable = false;
                vm.alert.user = '4~64位非纯数字，英文数字下划线组合，只能以英文开头';
            }
        }

        vm.changeView = function() {// 密码可见
            if (vm.template.password) {
                vm.eye = !vm.eye;
            }
        }

        vm.register = function() {// 注册
            if (!vm.unavailable) {
                if ($scope.registerForm.$valid) {
                    vm.info.userPassword = md5.createHash(vm.template.password);
                    Api.Register.Name(vm.info).$promise.then(function(data) {
                        if (data.statusCode == code) {
                            vm.InfoModel('注册成功', 'success');
                            $state.go('index');
                        } else {
                            vm.template.submited = true;
                            vm.InfoModel('注册失败,请检查信息是否填写完整！', 'error');
                        }
                    })
                } else {
                    vm.template.submited = true;
                    // vm.InfoModel('注册失败,请检查信息是否填写完整！', 'error');
                }
            }
        }

        // 弹窗引用
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
