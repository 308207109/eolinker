(function() {
    /* footer指令 */
    angular.module('eolinker').directive('eoFooter', ['$timeout', "$window", function($timeout, $window, EVENT) {
        return {
            restrict: 'AE',
            templateUrl: 'app/footer/footer.html',
            replace: true,
            controller: eoFooter,
            controllerAs:'footerCtrl'
        }
    }])

    eoFooter.$inject = ['$scope']

    function eoFooter($scope) {
        var vm=this;
    }

})();