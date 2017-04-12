(function() {
    'use strict';

    angular.module('eolinker.directive')
    /* 自动补全指令 */
    .directive('autoComplete', ['$compile', '$timeout', function($compile,$timeout) {
        return {
            restrict: 'A',
            scope: {
                array: '=', //自定义数组填充数组
                model: '=' //输入框绑定
            },
            link: function($scope, elem, attrs, ngModel) { //attrs placeholder(插入input placeholder )、addClass插入input class 、autoComplete input相关id 
                var html = '<div ng-mouseover="mouseLeave=false" ng-mouseleave="mouseLeave=true">' +
                    '<input placeholder="' + (attrs.placeholder ? attrs.placeholder : '') + '" id="' + attrs.autoComplete + '"class="eo-input ' + (attrs.addClass ? attrs.addClass : '') + '" data-ng-model="model" data-ng-change="modelChange()" data-ng-blur="modelBlur()"  maxlength="255">' +
                    '<div class="auto-complete-message" data-ng-class="{\'hidden\':template.hide!=0}">' +
                    '<ul>' +
                    '<li ng-repeat="item in template.array track by $index" data-ng-click="changeText(item)">{{item}}</li>' +
                    '</ul>' +
                    '</div>' +
                    '<div class="auto-complete-message" data-ng-class="{\'hidden\':template.hide!=1}">' +
                    '<ul>' +
                    '<li ng-repeat="item in array track by $index" data-ng-click="changeText(item)">{{item}}</li>' +
                    '</ul>' +
                    '</div>' +
                    '<label for="' + attrs.autoComplete + '" class="iconfont icon-triangledownfill" ng-click="changeSwitch()"></label>' +
                    '</div>';
                $scope.template = {
                    hide: -1, //-1所有隐藏，0：显示过滤值，1：显示全部值,
                    array: $scope.array,
                    keydown: {
                        preCount: -1,
                        count: -1,
                        elem: null,
                        originParent: null,
                        originElem: null,
                        originNextParent: null,
                        originNextElem: null
                    }
                }
                var init = function() {
                    angular.element(elem).append($compile(html)($scope));
                }
                init();
                var timer = $timeout(function() {
                    $scope.template.keydown.originParent = angular.element(angular.element(elem[0].children[0])[0].children[1])[0];
                    $scope.template.keydown.originElem = angular.element(angular.element(angular.element(elem[0].children[0])[0].children[1])[0].children[0])[0];
                    $scope.template.keydown.originNextParent = angular.element(angular.element(elem[0].children[0])[0].children[2])[0];
                    $scope.template.keydown.originNextElem = angular.element(angular.element(angular.element(elem[0].children[0])[0].children[2])[0].children[0])[0];
                }, 0, true)
                $scope.modelChange = function() { //input框信息改变触发函数
                    $scope.template.hide = 0;
                    if ($scope.model) {
                        $scope.template.array = [];
                        var template = {
                            count: 0
                        }
                        angular.forEach($scope.array, function(val, key) {
                            var pattern = '/^' + $scope.model.toLowerCase() + '/';
                            if (eval(pattern).test(val.toLowerCase())) {
                                $scope.template.array.splice(template.count, 0, val);
                                template.count++;
                            } else if (val.toLowerCase().indexOf($scope.model.toLowerCase()) > -1) {
                                $scope.template.array.push(val);
                            }
                        })
                        if ($scope.template.array.length <= 0) {
                            $scope.template.hide = -1;
                        }
                    } else {
                        $scope.template.array = $scope.array;
                    }
                }
                $scope.changeSwitch = function() { //单击下拉按钮显示下拉菜单函数
                    if ($scope.template.hide == -1) {
                        $scope.template.hide = 1;
                    }

                }
                $scope.changeText = function(info) { //选中下拉框单项内容执行函数
                    $scope.model = info;
                    $scope.template.hide = -1;
                    $scope.reset();
                }
                $scope.modelBlur = function() { //失去焦点执行函数
                    if ($scope.mouseLeave) {
                        $scope.template.hide = -1;
                        $scope.reset();
                    }
                }
                $scope.reset = function() {
                    $scope.template.keydown.originParent.scrollTop = 0;
                    $scope.template.keydown.originNextParent.scrollTop = 0;
                    $scope.template.keydown.count = -1;
                    if ($scope.template.keydown.elem) {
                        $scope.template.keydown.elem.style.backgroundColor = null;
                    }
                    try {
                        $scope.$digest();
                    } catch (e) {}

                }
                elem.on('keydown', function(e) { //监听keydown函数
                    switch (e.keyCode) {
                        case 38:
                            { // up
                                e.preventDefault();
                                var template = {
                                    parent: $scope.template.hide == 0 ? $scope.template.keydown.originParent : $scope.template.keydown.originNextParent,
                                    origin: $scope.template.hide == 0 ? $scope.template.keydown.originElem : $scope.template.keydown.originNextElem
                                };
                                $scope.template.keydown.preCount = $scope.template.keydown.count;
                                if ($scope.template.keydown.elem) {
                                    $scope.template.keydown.elem.style.backgroundColor = null;
                                }
                                if ($scope.template.keydown.count == -1 || $scope.template.keydown.count == 0) {
                                    $scope.template.keydown.count = template.origin.childElementCount - 1;
                                } else {
                                    $scope.template.keydown.count--;
                                }
                                $scope.template.keydown.elem = angular.element(template.origin.children[$scope.template.keydown.count])[0];
                                $scope.template.keydown.elem.style.backgroundColor = '#fafafa';
                                if ($scope.template.keydown.count < $scope.template.keydown.preCount) {
                                    template.parent.scrollTop = ($scope.template.keydown.count - 4) * $scope.template.keydown.elem.offsetHeight;
                                } else {
                                    template.parent.scrollTop = $scope.template.keydown.count * $scope.template.keydown.elem.offsetHeight;
                                }
                                return false;
                                break;
                            }

                        case 40:
                            { // down
                                e.preventDefault();
                                var template = {
                                    parent: $scope.template.hide == 0 ? $scope.template.keydown.originParent : $scope.template.keydown.originNextParent,
                                    origin: $scope.template.hide == 0 ? $scope.template.keydown.originElem : $scope.template.keydown.originNextElem
                                };
                                $scope.template.keydown.preCount = $scope.template.keydown.count;
                                if ($scope.template.keydown.elem) {
                                    $scope.template.keydown.elem.style.backgroundColor = null;
                                }
                                if ($scope.template.keydown.count == (template.origin.childElementCount - 1)) {
                                    $scope.template.keydown.count = 0;
                                } else {
                                    $scope.template.keydown.count++;
                                }
                                $scope.template.keydown.elem = angular.element(template.origin.children[$scope.template.keydown.count])[0];
                                $scope.template.keydown.elem.style.backgroundColor = '#fafafa';
                                if ($scope.template.keydown.count > 4) {
                                    template.parent.scrollTop = ($scope.template.keydown.count - 4) * $scope.template.keydown.elem.offsetHeight;
                                } else if ($scope.template.keydown.count < $scope.template.keydown.preCount) {
                                    template.parent.scrollTop = 0;
                                }
                                return false;
                                break;
                            }
                        case 13:
                            { //enter
                                e.preventDefault();
                                if ($scope.template.keydown.elem) {
                                    $scope.changeText($scope.template.keydown.elem.innerText);
                                }
                                return false;
                                break;
                            }
                    }
                });
                $scope.$on('$destroy', function() { //页面更改消除计时器
                    if (timer) {
                        $timeout.cancel(timer);
                    }
                });
            }
        };
    }]);
})();
