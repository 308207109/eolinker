(function() {
    /* 首页指令 */
    angular.module('eolinker').directive('index', ['$timeout', "$window", function($timeout, $window, EVENT) {
        return {
            restrict: 'AE',
            templateUrl: 'app/page/index/index.html',
            // replace:true,
            controller: indexCtroller,
            controllerAs: 'indexCtrl',
        }
    }])

    indexCtroller.$inject = ['$scope', '$timeout', 'Api', '$state', 'CODE', 'md5', '$cookies', '$uibModal', '$window', '$rootScope'];

    function indexCtroller($scope, $timeout, Api, $state, CODE, md5, $cookies, $uibModal, $window, $rootScope) {
        var vm = this;
        var code = CODE.SUCCESS;
        vm.info = {
            loginName: '',
            loginPassword: ''
        }

        vm.templatePassword = '';
        vm.clock = '';

        function init() { // 初始化首页
            window.document.title = 'eolinker开源版';
            // 加载particles-js
            particlesJS.load('particles-js', 'vendor/particles.js/demo/particles.json', function() {
                console.log('callback - particles.js config loaded');
            });
            vm.projectLogo = 'app/assets/images/eolinker_os.png';
            vm.logo = 'app/assets/images/t0_os.png';

            if (window.localStorage['LOGININFO']) {
                try {
                    var info = JSON.parse(window.localStorage['LOGININFO']);
                    vm.info.loginName = info.loginName;
                    vm.templatePassword = info.templatePassword;
                    vm.isRemember = true;
                } catch (e) {
                    vm.info.loginName = '';
                    vm.templatePassword = '';
                    vm.isRemember = false;
                }
            }

            Api.Logintype.Check().$promise.then(function(data) {
                if (data.statusCode == code) {
                    vm.hadLogin = true;
                } else {
                    vm.hadLogin = false;
                }
            });

            Api.Install.Config().$promise.then(function(data) {
                if (data.statusCode !== code) {
                    $state.go('guide.first_step');
                }
            });
        }
        init();

        vm.enter = function() { //  “查看项目列表”按钮，跳转到项目列表页面
            $state.go('home.project.api');
        }

        vm.login = function() { //  “登录”按钮，登录成功则跳转到项目列表页面
            var userInfo = {
                loginName: vm.info.loginName,
                templatePassword: vm.templatePassword
            }
            if ($scope.loginForm.$valid) {
                vm.submitted = false;
                vm.info.loginPassword = md5.createHash(vm.templatePassword);
                Api.Login.Post(vm.info).$promise.then(function(data) {
                    if (data.statusCode == code) {
                        $cookies.put("userToken", data.userToken);
                        if (vm.isRemember) {
                            window.localStorage.setItem('LOGININFO', JSON.stringify(userInfo));
                        } else {
                            window.localStorage.removeItem('LOGININFO');
                        }
                        $state.go('home.project.api');
                    } else {
                        vm.InfoModel('登录失败,请检查密码是否正确！', 'error');
                    }
                })
            } else {
                vm.submitted = true;
            }
        }

        vm.changeView = function() { //  “密码可见”按钮
            if (vm.templatePassword) {
                vm.eye = !vm.eye;
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
