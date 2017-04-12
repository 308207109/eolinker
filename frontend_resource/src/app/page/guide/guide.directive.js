(function() {
    /* 引导页内页容器指令 */
    angular.module('eolinker').directive('guide', ['$timeout', "$window", function($timeout, $window, EVENT) {
        return {
            restrict: 'AE',
            templateUrl: 'app/page/guide/guide.html',
            // replace:true,
            controller: guideCtroller,
            controllerAs: 'guideCtrl'
        }
    }])

    guideCtroller.$inject = ['$scope', '$timeout', '$state', '$uibModal'];

    function guideCtroller($scope, $timeout, $state,  $uibModal) {

        var vm = this;
        function init() {// 初始化引导页面
            vm.projectLogo = 'app/assets/images/eolinker_os.png';
        }
        init();
    }

})();
