(function() {
    'use strict';

    angular.module('eolinker.directive')
        /* 判断溢出指令 */
        .directive('checkOverflow', ['$timeout', function($timeout) {
            return {
                restrict: 'A',
                scope: {
                    isOverflow: '=' // 是否溢出
                },
                link: function($scope, elem, attrs, ctrl) {
                    var timer = null;
                    var init = function() {
                        timer = $timeout(function() {
                        if (elem[0].offsetWidth > (elem.parent()[0].offsetWidth - 28)) {
                            $scope.isOverflow = true;
                        }
                    });
                    }
                    init();
                    $scope.$on('$destroy', function() { // 页面跳转触发事件
                        if (timer) {
                            $timeout.cancel(timer);
                        }
                    });
                }
            };
        }]);
})();
