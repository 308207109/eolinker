(function() {
    /* 数据库内页容器指令 */
    angular.module('eolinker').directive('database', [ "$window", function( $window, EVENT) {
        return {
            restrict: 'AE',
            templateUrl: 'app/page/database/database.html',
            // replace:true,
            controller: databasePage,
            controllerAs: 'databaseCtrl'
        }
    }])

    databasePage.$inject = ['$scope',  'Api', '$state', 'CODE', '$uibModal'];

    function databasePage($scope, Api, $state, CODE, $uibModal) {

        var vm = this;
        var code = CODE.SUCCESS;
        vm.info = {};
        function init() {
           
        }
        init();
    }

})();
