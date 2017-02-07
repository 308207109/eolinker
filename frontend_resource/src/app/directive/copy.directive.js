(function() {
    'use strict';

    angular.module('eolinker.directive')
    /* 复制指令 */
    .directive('copyDirective', [function() {
        return {
            restrict: 'A',
            transclude: true,
            //replace: true,
            require: '?ngModel',
            template: '<input type="text" id="{{copyId}}" name="link" data-ng-model="copyModel" class="{{\'eo-input \'+copyClass}}" data-clipboard-action="copy" data-clipboard-target="{{\'#\'+copyId}}" ng-class="{\'eo-copy\':(copy.success)&&(copy.isClick)}" readonly>' + '<label for="{{copyId}}" class="pull-right copy-tips " ng-class="{\'copy-success\':(copy.success)&&(copy.isClick),\'copy-error\':(!copy.success)&&(copy.isClick)}">' + '{{!copy.isClick?\'点击复制\':copy.success?\'复制成功\':\'复制失败\'}}' + '</label>',
            scope: {
                copyId: '@',// input标签id
                copyModel: '=',// mock内容
                copyClass: '@',// input标签样式
                isDouble: '@'// 是否存在多个复制指令
            },
            link: function($scope, elem, attrs, ngModel) {
                $scope.copy = {
                    isClick: false,
                    success: false,
                    clipboard: ''
                }
                $scope.copyClass = !!$scope.copyClass ? $scope.copyClass : 'code-copy';
                var init = function(message) {// 初始化剪贴板
                    $scope.copy.clipboard = new Clipboard(message);
                    $scope.copy.clipboard.on('success', function(e) {
                        $scope.copy.success = true;
                        $scope.copy.isClick = true;
                        $scope.$digest();
                        console.info('Action:', e.action);
                        console.info('Text:', e.text);
                        console.info('Trigger:', e.trigger);
                        e.clearSelection();
                    });

                    $scope.copy.clipboard.on('error', function(e) {
                        $scope.copy.success = false;
                        $scope.copy.isClick = true;
                        $scope.$digest();
                        console.error('Action:', e.action);
                        console.error('Trigger:', e.trigger);
                    });
                }
                if (ngModel) {
                    ngModel.$render = function() {// ngModel.$render值发生变化时函数
                        if ($scope.isDouble) {
                            if ($scope.copy.clipboard) {
                                $scope.copy.clipboard.destroy();
                                $scope.copy = {
                                    isClick: false,
                                    success: false,
                                    clipboard: ''
                                }
                            }
                            init('.' + $scope.copyClass);
                        }else{
                            if(ngModel.$viewValue){
                                $scope.copy.clipboard.destroy();
                            }else{
                                init('.' + $scope.copyClass);
                            }
                        }

                    };
                } else {
                    init('.' + $scope.copyClass);
                }
                $scope.$on('$stateChangeSuccess', function() {// 路由改变时销毁剪贴板
                    $scope.copy.clipboard.destroy();
                })
            }
        };
    }]);
})();
