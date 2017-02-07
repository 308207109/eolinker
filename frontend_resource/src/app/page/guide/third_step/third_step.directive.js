(function() {
    /* 引导页第三步指令 */
    angular.module('eolinker').directive('third', ['$timeout', "$window", function($timeout, $window, EVENT) {
        return {
            restrict: 'AE',
            templateUrl: 'app/page/guide/third_step/third_step.html',
            // replace:true,
            controller: thirdCtroller,
            controllerAs: 'thirdCtrl'
        }
    }])

    thirdCtroller.$inject = ['$scope', '$timeout', 'Api', '$state', 'CODE', 'md5', '$cookies', '$uibModal', '$window', '$rootScope'];

    function thirdCtroller($scope, $timeout, Api, $state, CODE, md5, $cookies, $uibModal, $window, $rootScope) {
        var vm = this;
        var code = CODE.SUCCESS;
        vm.installing = false;
        vm.check = {
            fileWrite: '',
            curl: '',
            db: ''
        };
        vm.query = [];

        function init() {// 初始化页面
            vm.info = {};
            /*
             * 判断用户是否已安装
             * 若已安装则跳转首页
             */
            Api.Install.Config().$promise.then(function(data) {
                if (data.statusCode == code) {
                    $state.go('index');
                }
            });

            if (window.localStorage['INSTALLINFO']) {
                try {
                    vm.info = {};
                    var info = JSON.parse(window.localStorage['INSTALLINFO']);
                    vm.info.dbURL = info.master;
                    vm.info.dbName = info.name;
                    vm.info.dbUser = info.userName;
                    vm.info.dbPassword = info.password;
                } catch (e) {
                    $state.go('guide.second_step');
                }
            } else {
                $state.go('guide.second_step');
            }
            checkConfig();
        }

        function checkConfig() {// 配置检测
            Api.Install.Check(vm.info).$promise.then(function(data) {
                if (data.statusCode == code) {
                    vm.query = data.envStatus;
                    if (data.envStatus.fileWrite == 1) {
                        vm.check.fileWrite = 'ok';
                    } else {
                        vm.check.fileWrite = 'error';
                    }
                    if (data.envStatus.curl == 1) {
                        vm.check.curl = 'ok';
                    } else {
                        vm.check.curl = 'error';
                    }
                    if (data.envStatus.db == 1) {
                        vm.check.db = 'ok';
                    } else {
                        vm.check.db = 'error';
                    }
                }
            });
        }

        init();
       
        vm.check =function(){// “重新检测”按钮
            checkConfig();
        }

        vm.enterSecond = function() {// 跳转安装第二步
            $state.go('guide.second_step');
        }

        vm.install = function() {// 开始安装
            vm.installing = true;

            Api.Install.Post(vm.info).$promise.then(function(data) {
                if (data.statusCode == code) {
                    $state.go('guide.finish');
                } else {
                    $state.go('guide.error');
                }
            })
        }
    }

})();
