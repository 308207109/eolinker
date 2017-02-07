(function() {
    'use strict';

    angular.module('eolinker.directive')
    /* 加载状态指令 */
    .directive('loadDirective', [function() {
        return {
            restrict: 'A',
            transclude: true,
            replace: true,
            template: '<div class="loading-content" ng-class="{\'hidden\':isEnd}">' +
                '<div class="loading" >' +
                '<ul>' +
                '<li>' +
                '<div ><span class="iconfont  icon-loading"></span></div>正在载入' +
                '</li>' +
                '</ul>' +
                '</div>' +
                '</div>',
            scope: {
                isEnd: '='
            },
            link: function($scope, elem, attrs, ctrl) {
            }
        };
    }]);
})();
