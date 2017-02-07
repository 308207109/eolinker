(function() {
    /* 状态码内页容器指令 */
    angular.module('eolinker').directive('projectCode', ['$timeout', "$window", function($timeout, $window, EVENT) {
        return {
            restrict: 'AE',
            templateUrl: 'app/page/project/content/code/code.html',
            // replace:true,
            controller: projectCode,
            controllerAs: 'projectCodeCtrl'
        }
    }])

    projectCode.$inject = ['$scope',  '$timeout', 'Api', '$state','CODE'];

    function projectCode($scope, $timeout, Api, $state, CODE) {

        var vm = this;
        var code = CODE.SUCCESS;
        function init() {
            
        }
        init();
    }

})();
