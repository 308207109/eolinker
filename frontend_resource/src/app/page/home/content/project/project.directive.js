(function() {
    /* 项目列表/数据库列表内页器指令 */
    angular.module('eolinker').directive('homeProject', ['$timeout', "$window", function($timeout, $window, EVENT) {
        return {
            restrict: 'AE',
            templateUrl: 'app/page/home/content/project/project.html',
            // replace:true,
            controller: homeProjectCtroller,
            controllerAs: 'homeProjectCtrl'
        }
    }])

    homeProjectCtroller.$inject = ['$scope', 'Api', '$state', 'CODE', '$uibModal', '$rootScope','$timeout'];

    function homeProjectCtroller($scope, Api, $state, CODE, $uibModal, $rootScope,$timeout) {
        var vm = this;
        var code = CODE.SUCCESS;
    }

})();
