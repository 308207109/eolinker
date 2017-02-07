(function() {
    /* 注册内页容器指令 */
    angular.module('eolinker').directive('register', ['$timeout', "$window", function($timeout, $window, EVENT) {
        return {
            restrict: 'AE',
            templateUrl: 'app/page/register/register.html',
            // replace:true,
            controller: registerCtroller,
            controllerAs: 'registerCtrl'
        }
    }])

    registerCtroller.$inject = ['$scope', '$timeout', '$state', '$uibModal'];

    function registerCtroller($scope, $timeout, $state,  $uibModal) {

        var vm = this;
        vm.isProtocol=false;
       
        function init() {// 初始化注册页面
            window.document.title='eolinker开源版';
            // 加载particles-js
            particlesJS.load('particles-js', 'vendor/particles.js/demo/particles.json', function() {
                console.log('callback - particles.js config loaded');
            });
            vm.projectLogo = 'app/assets/images/eolinker_os.png';
            vm.isProtocol=$state.current.name.indexOf('protocol')>-1?true:false;
        }
        init();
        
        $scope.$on('$stateChangeSuccess', function() {// 当路由改变时判断是否跳转protocol页面
            vm.isProtocol=$state.current.name.indexOf('protocol')>-1?true:false;
        })
    }

})();
