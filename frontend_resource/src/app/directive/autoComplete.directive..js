(function() {
    'use strict';

    angular.module('eolinker.directive')
    /* 自动补全指令 */
    .directive('autoComplete', ['$compile',  function($compile) {
        return {
            restrict: 'A',
            scope: {
                array: '=',// 可能需要补全的数组
                model: '=',// 输入的数据
                mouseLeave: '=',// 鼠标是否离开
                queryIndex: '@'// 索引值   
            },
            require: "ngModel",
            link: function($scope, elem, attrs, ngModel) {
                var html = '<div class="auto-complete-message" ng-class="{hidden:!query.labelIsClick}">' + '<ul>' + '<li ng-repeat="array in headerQuery track by $index" data-ng-click="changeText(array)">{{array}}</li>' + '</ul>' + '</div>' + '<label for="{{queryIndex}}" class="iconfont icon-triangledownfill" ng-click="changeSwitch()"></label>';
                var timer = null;
                var init = function() {// 将补全列表插入DOM中
                    angular.element(elem).parent().append($compile(html)($scope));
                }
                init();
                $scope.mouseLeave = true;
                ngModel.$parsers.push(function(value) {//ng-model输入内容执行函数
                    $scope.headerQuery = [];
                    angular.forEach($scope.array, function(val, key) {
                        if (val.toUpperCase().indexOf(value.toUpperCase()) > -1) {
                            $scope.headerQuery.push(val);
                        }
                    })
                    if ($scope.headerQuery.length <= 0) {
                        angular.element(elem).next().addClass('hidden');
                    } else {
                        angular.element(elem).next().removeClass('hidden');
                    }
                    return value;
                });
                $scope.changeSwitch = function() {//单击下拉按钮显示下拉菜单函数
                    if (!!ngModel.$modelValue) {
                        $scope.headerQuery = [];
                        angular.forEach($scope.array, function(val, key) {
                            if (val.toUpperCase().indexOf(ngModel.$modelValue.toUpperCase()) > -1) {
                                $scope.headerQuery.push(val); 
                            }
                        })
                    } else {
                        $scope.headerQuery = $scope.array;
                    }
                    angular.element(elem).next().removeClass('hidden');
                }
                $scope.changeText = function(info) {//选中下拉框单项内容执行函数
                    $scope.model = info;
                    angular.element(elem).next().addClass('hidden');
                }
                elem.bind('blur', function(e) {//节点失去焦点执行函数
                    if ($scope.mouseLeave) {
                        angular.element(elem).next().addClass('hidden');
                    }
                })
            }
        };
    }]);
})();
