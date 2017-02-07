(function() {
    /* 弹窗指令 */
    angular.module('eolinker').directive('eoModel', ['$timeout', "$window", function($timeout, $window, EVENT) {
        return {
            restrict: 'AE',
            templateUrl: 'app/model/model.html',
            //replace: true,
            controller: eoModel
        }
    }])

    eoModel.$inject = ['$scope']

    function eoModel($scope) {
    }

})();
