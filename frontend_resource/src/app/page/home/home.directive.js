(function() {
    /* 内页容器指令 */
    angular.module('eolinker').directive('home', ['$timeout', "$window", function($timeout, $window, EVENT) {
        return {
            restrict: 'AE',
            templateUrl: 'app/page/home/home.html',
            // replace:true,
            controller: homePage,
            controllerAs: 'homeCtrl'
        }
    }])

    homePage.$inject = ['$scope', 'Api', '$state', '$window', 'CODE', '$cookies', '$uibModal', '$rootScope'];

    function homePage($scope, Api, $state, $window, CODE, $cookies, $uibModal, $rootScope) {

        var vm = this;
        var code = CODE.SUCCESS;
        vm.info = {}

        function init() {
        }
        init();
    }

})();
