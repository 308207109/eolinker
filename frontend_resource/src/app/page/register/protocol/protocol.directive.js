(function() {
    /* 协议指令 */
    angular.module('eolinker').directive('registerProtocol', ['$timeout', "$window", function($timeout, $window, EVENT) {
            return {
                restrict: 'AE',
                templateUrl: 'app/page/register/protocol/protocol.html',
                // replace:true,
                controller: registerProtocolCtroller,
                controllerAs: 'registerProtocolCtrl'
            }
        }])
        .run(['$anchorScroll', function($anchorScroll) {
            // 总是滚动额外的50像素
            $anchorScroll.yOffset = 50; 

        }])

    registerProtocolCtroller.$inject = ['$scope', '$timeout', '$location', '$anchorScroll', '$window'];

    function registerProtocolCtroller($scope, $timeout, $location, $anchorScroll, $window) {
        var vm = this;
       
        vm.goAnchor = function(info) {// 移动到指定锚点
            $location.hash(info);
            // 移动到锚点
            $anchorScroll();
        };
        
        $window.onscroll = function() {// 当文档滚动超过246px导航栏固定在页面顶端
            if ($window.scrollY > 246) {
                angular.element(document.getElementById('fix-nav-js')).addClass('fix-nav');
            } else {
                angular.element(document.getElementById('fix-nav-js')).removeClass('fix-nav');
            }

        }

    }

})();
