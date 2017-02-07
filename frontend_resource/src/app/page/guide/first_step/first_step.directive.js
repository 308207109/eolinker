(function() {
    /* 引导页第一步指令 */
    angular.module('eolinker').directive('first', ['$timeout', "$window", function($timeout, $window, EVENT) {
        return {
            restrict: 'AE',
            templateUrl: 'app/page/guide/first_step/first_step.html',
            // replace:true,
            controller: firstCtroller,
            controllerAs: 'firstCtrl'
        }
    }])

    firstCtroller.$inject = ['$scope', '$timeout', 'Api', '$state', 'CODE', 'md5', '$cookies', '$uibModal', '$window', '$rootScope'];

    function firstCtroller($scope, $timeout, Api, $state, CODE, md5, $cookies, $uibModal, $window, $rootScope) {
        var vm = this;
        var code = CODE.SUCCESS;

        function init() {// 初始化页面
            /*
             * 判断用户是否已安装
             * 若已安装则跳转首页
             */
            Api.Install.Config().$promise.then(function(data) {
                if (data.statusCode == code) {
                    $state.go('index');
                }
            });
        }
        init();
       
        vm.enterSecond = function() {// 跳转安装第二步
            $state.go('guide.second_step')
        }

    }

})();
