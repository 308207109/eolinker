(function() {
    'use strict';
    //作者：riverLethe
    angular.module('eolinker.directive')
        /*格式整理指令*/
        .directive('arrangeJson', ['$compile', '$uibModal', '$filter', function($compile, $uibModal, $filter) {
            return {
                restrict: 'A',
                scope: {
                    resultType: '=', //请求结果类型
                    isJson: '=' //是否为json
                },
                require: '?ngModel',
                link: function($scope, elem, attrs, ngModel) {
                    var info = '';
                    var isError = false;
                    if (ngModel) {
                        ngModel.$render = function() { //ngModel.$render ng-model值发生变化时执行函数
                            var text = ngModel.$viewValue;
                            if (text) {
                                if (!!attrs.onlyOneTime) { //仅格式整理不相互转化
                                    angular.element(document.getElementById(attrs.onlyOneTime)).empty();
                                    if (text.substr(0, 1) === '<' && text.substr(-1, 1) === '>') {
                                        try {
                                            document.getElementById(attrs.onlyOneTime).innerText = $filter('HtmlformatFilter')(text, 5);
                                        } catch (e) {
                                            document.getElementById(attrs.onlyOneTime).innerText = text;
                                        }
                                    } else {
                                        try {
                                            angular.element(document.getElementById(attrs.onlyOneTime)).append($compile($filter('JsonformatFilter')(text, 4).toString())($scope));
                                        } catch (e) {
                                            document.getElementById(attrs.onlyOneTime).innerText = text;
                                        }
                                    }
                                } else if ($scope.resultType) { //自定义格式整理类型（0:json,1:xml,2:html）
                                    isError = false;
                                    $scope.isJson = true;
                                    document.getElementById(attrs.textareaJson).innerText = text;
                                    switch ($scope.resultType) {
                                        case 0:
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
                                            {
                                                if (text.substr(0, 1) === '<' && text.substr(-1, 1) === '>') {
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
                                                } else {
                                                    $scope.isJson = false;
                                                    isError = true;
                                                    angular.element(document.getElementById(attrs.arrangeJson)).addClass('hidden');
                                                    angular.element(document.getElementById(attrs.textareaJson)).removeClass('hidden');
                                                }
                                                break;
                                            }
                                        case 2:
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
                                } else { //主动判断格式是否为json或xml进行整理
                                    isError = false;
                                    $scope.isJson = true;
                                    document.getElementById(attrs.textareaJson).innerText = text;
                                    if (text.replace(/\s/g,"").substr(0, 1) === '<' && text.replace(/\s/g,"").substr(-1, 1) === '>') {
                                        try {
                                            angular.element(document.getElementById(attrs.arrangeJson)).empty();
                                            console.log(text)
                                            console.log($filter('HtmlformatFilter')(text, 5))
                                            document.getElementById(attrs.arrangeJson).innerText = $filter('HtmlformatFilter')(text, 5);
                                            console.log(document.getElementById(attrs.arrangeJson).innerText)
                                            angular.element(document.getElementById(attrs.arrangeJson)).removeClass('hidden');
                                            angular.element(document.getElementById(attrs.textareaJson)).addClass('hidden');
                                        } catch (e) {
                                            $scope.isJson = false;
                                            isError = true;
                                            angular.element(document.getElementById(attrs.arrangeJson)).addClass('hidden');
                                            angular.element(document.getElementById(attrs.textareaJson)).removeClass('hidden');
                                        }
                                    } else {
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
                                    }
                                }
                            }else{
                                angular.element(document.getElementById(attrs.arrangeJson)).empty();
                                angular.element(document.getElementById(attrs.textareaJson)).empty();
                            }
                        };
                    }
                    $scope.hide = function hide(obj) {
                        obj = obj.target;
                        var data_type = obj.parentNode.getAttribute('data-type');
                        var data_size = obj.parentNode.getAttribute('data-size');
                        obj.parentNode.setAttribute('data-inner', obj.parentNode.innerHTML);
                        var info = '';
                        if (data_type === 'array') {
                            info = '<i  style="cursor:pointer;" class="iconfont icon-xinzeng" ng-click="show($event)" ></i>Array[<span class="json_number">' + data_size + '</span>]';
                        } else {
                            info = '<i style="cursor:pointer;" class="iconfont icon-xinzeng" ng-click="show($event)"></i>Object{...}';
                        }
                        obj = obj.parentNode;
                        angular.element(obj).empty();
                        angular.element(obj).append($compile(info)($scope));
                    }

                    $scope.show = function show(obj) {
                        obj = obj.target;
                        var innerHtml = obj.parentNode.getAttribute('data-inner');
                        obj = obj.parentNode;
                        angular.element(obj).empty();
                        angular.element(obj).append($compile(innerHtml)($scope));
                    }

                    elem.bind('click', function(event) {
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
                    //弹窗引用
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
