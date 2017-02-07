(function() {
    'use strict';

    angular.module('eolinker.directive')
    /* 格式整理指令 */     
    .directive('arrangeJson', ['$compile', '$uibModal', '$filter', function($compile, $uibModal, $filter) {
        return {
            restrict: 'A',
            scope: {
                resultType: '=',// 请求结果类型
                isJson: '='// 是否为JSON
            },
            require: '?ngModel',
            link: function($scope, elem, attrs, ngModel) {
                var info = '';
                var isError = false;
                if (ngModel) {
                    ngModel.$render = function() {// ngModel.$render值发生变化时函数
                        var text = ngModel.$viewValue;
                        if (!!attrs.onlyOneTime) { // 是否非来回转换
                            angular.element(document.getElementById(attrs.onlyOneTime)).empty();
                            try {
                                angular.element(document.getElementById(attrs.onlyOneTime)).append($compile('<div class="request-param-raw-content" >' + $filter('JsonformatFilter')(text, 4).toString() + '</div>')($scope));
                            } catch (e) {
                                angular.element(document.getElementById(attrs.onlyOneTime)).append($compile('<pre class="eo-pre request-param-raw-content" >' + text + '</pre>')($scope));
                            }
                        } else { // 自由来回转换格式整理
                            isError = false;
                            $scope.isJson = true;
                            document.getElementById(attrs.textareaJson).innerText = text;
                            switch ($scope.resultType) {
                                case 0:
                                // json格式整理
                                    {
                                        try {
                                            angular.element(document.getElementById(attrs.arrangeJson)).empty();
                                            angular.element(document.getElementById(attrs.arrangeJson)).append($compile($filter('JsonformatFilter')(text, 4).toString())($scope));
                                            angular.element(document.getElementById(attrs.arrangeJson)).removeClass('hidden');
                                            angular.element(document.getElementById(attrs.textareaJson)).addClass('hidden');
                                        } catch (e) {
                                            $scope.isJson = false;
                                            isError = true;
                                            angular.element(document.getElementById(attrs.arrangeJson)).addClass('hidden');
                                            angular.element(document.getElementById(attrs.textareaJson)).removeClass('hidden');
                                        }
                                        break;
                                    }
                                case 1:
                                // xml格式整理
                                    {
                                        if (text.substr(0, 1) === '<' && text.substr(-1, 1) === '>') {
                                            try {
                                                var parser = new window.DOMParser();
                                                var xml = parser.parseFromString(text, "application/xml");
                                                var json = JSON.stringify($filter('XmlformatFilter')(xml));
                                                angular.element(document.getElementById(attrs.arrangeJson)).empty();
                                                angular.element(document.getElementById(attrs.arrangeJson)).append($compile($filter('JsonformatFilter')(json, 4).toString())($scope));
                                                angular.element(document.getElementById(attrs.arrangeJson)).removeClass('hidden');
                                                angular.element(document.getElementById(attrs.textareaJson)).addClass('hidden');
                                            } catch (e) {
                                                $scope.isJson = false;
                                                isError = true;
                                                angular.element(document.getElementById(attrs.arrangeJson)).addClass('hidden');
                                                angular.element(document.getElementById(attrs.textareaJson)).removeClass('hidden');
                                            }
                                        } else {
                                            $scope.isJson = false;
                                            isError = true;
                                            angular.element(document.getElementById(attrs.arrangeJson)).addClass('hidden');
                                            angular.element(document.getElementById(attrs.textareaJson)).removeClass('hidden');
                                        }
                                        break;
                                    }
                                case 2:
                                // html格式整理
                                    {
                                        try {
                                            angular.element(document.getElementById(attrs.arrangeJson)).empty();
                                            document.getElementById(attrs.arrangeJson).innerText = $filter('HtmlformatFilter')(text, 5);
                                            angular.element(document.getElementById(attrs.arrangeJson)).removeClass('hidden');
                                            angular.element(document.getElementById(attrs.textareaJson)).addClass('hidden');
                                        } catch (e) {
                                            $scope.isJson = false;
                                            isError = true;
                                            angular.element(document.getElementById(attrs.arrangeJson)).addClass('hidden');
                                            angular.element(document.getElementById(attrs.textareaJson)).removeClass('hidden');
                                        }
                                        break;
                                    }
                                default:
                                    {
                                        $scope.isJson = false;
                                        isError = true;
                                        angular.element(document.getElementById(attrs.arrangeJson)).addClass('hidden');
                                        angular.element(document.getElementById(attrs.textareaJson)).removeClass('hidden');
                                    }
                            }
                        }
                    };
                }

                $scope.hide = function hide(obj) {// 节点收缩函数
                    obj = obj.target;
                    var data_type = obj.parentNode.getAttribute('data-type');
                    var data_size = obj.parentNode.getAttribute('data-size');
                    obj.parentNode.setAttribute('data-inner', obj.parentNode.innerHTML);
                    var info = '';
                    if (data_type === 'array') {
                        info = '<i style="cursor:pointer;" class="iconfont icon-xinzeng" ng-click="show($event)" ></i>Array[<span class="json_number">' + data_size + '</span>]';
                    } else {
                        info = '<i style="cursor:pointer;" class="iconfont icon-xinzeng" ng-click="show($event)"></i>Object{...}';
                    }
                    obj = obj.parentNode;
                    angular.element(obj).empty();
                    angular.element(obj).append($compile(info)($scope));
                }

                $scope.show = function show(obj) {// 节点展开函数
                    obj = obj.target;
                    var innerHtml = obj.parentNode.getAttribute('data-inner');
                    obj = obj.parentNode;
                    angular.element(obj).empty();
                    angular.element(obj).append($compile(innerHtml)($scope));
                }

                elem.bind('click', function(event) {// 切换格式整理按钮
                    $scope.isJson = !$scope.isJson;
                    if (isError) {
                        $scope.isJson = false;
                        InfoModel("相应格式错误", 'error');
                    } else {
                        if ($scope.isJson) {
                            angular.element(document.getElementById(attrs.textareaJson)).addClass('hidden');
                            angular.element(document.getElementById(attrs.arrangeJson)).removeClass('hidden');
                        } else {
                            angular.element(document.getElementById(attrs.arrangeJson)).addClass('hidden');
                            angular.element(document.getElementById(attrs.textareaJson)).removeClass('hidden');
                        }
                    }

                });
                // 弹窗引用
                var InfoModel = function openModel(info, type, callback) {
                    var modalInstance = $uibModal.open({
                        animation: true,
                        templateUrl: 'InfoModel',
                        controller: 'InfoModelCtrl',
                        resolve: {
                            info: function() {
                                return info;
                            },
                            type: function() {
                                return type;
                            }
                        }
                    });
                    modalInstance.result.then(callback);
                }
            }
        };
    }]);
})();
