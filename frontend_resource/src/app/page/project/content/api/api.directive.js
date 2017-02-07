(function() {
    /* 接口内页容器指令 */
    angular.module('eolinker').directive('projectApi', ['$timeout', "$window", function($timeout, $window, EVENT) {
        return {
            restrict: 'AE',
            templateUrl: 'app/page/project/content/api/api.html',
            // replace:true,
            controller: projectApi,
            controllerAs: 'projectApiCtrl'
        }
    }])

    projectApi.$inject = ['$scope',  '$timeout', 'Api', '$state','CODE'];

    function projectApi($scope, $timeout, Api, $state, CODE) {

        var vm = this;
        var code = CODE.SUCCESS;
        function init() {
            
        }
        init();
    }

})();
