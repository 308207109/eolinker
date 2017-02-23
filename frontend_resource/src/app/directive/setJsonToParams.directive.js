(function() {
    'use strict';
  
    angular.module('eolinker.directive')
        /* 匹配Json转换为Param指令 */
        .directive('setJsonToParams', ['$compile', '$uibModal', '$filter', function($compile, $uibModal, $filter) {
            return {
                restrict: 'A',
                scope: {
                    item: '@', // 设置初始object类集(可选) 
                    valueItem: '@',// 值可能性object类集（可选）
                    resetResult: '=' // 插入结果位置集（必选）
                },
                replace: true,
                template: '<button class="eo-button-info add-param-btn import-btn" data-ng-click="importJson()">导入JSON<span class="iconfont icon-add"></span></button>',
                //require: '?ngModel',
                link: function($scope, elem, attrs, ngModel) {
                    var vm = this;
                    vm.key = attrs.setJsonToParams ? attrs.setJsonToParams : 'key';// 数组参数个例变量名
                    vm.value = attrs.setValue ? attrs.setValue : 'value';// 数组参数个例值变量名
                    vm.valueKey = attrs.setValueKey ? attrs.setValueKey : 'key';// 数组参数个例值变量结果（如果vm.value存储为array及object时存在）
                    var params = [];
                    var JSONFormat = (function() {
                        var _toString = Object.prototype.toString;

                        function format(object, indent_count, parent) {// 判断类型执行相应格式处理函数
                            switch (_typeof(object)) {
                                case 'Null':
                                    _format_null(object);
                                    break;
                                case 'Boolean':
                                case 'Number':
                                case 'String':
                                    _format_string(object);
                                    break;
                                case 'Array':
                                    _format_array(object, indent_count, parent);
                                    break;
                                case 'Object':
                                    _format_object(object, indent_count, parent);
                                    break;
                            }
                        };

                        function _format_null(object) {// json值字段为null
                        }

                        function _format_string(object) {// json值字段为string
                            switch (_typeof(params[params.length - 1][vm.value])) {
                                case 'Array':
                                    try {
                                        var newItem = JSON.parse($scope.valueItem);
                                        newItem[vm.valueKey] = object;
                                        params[params.length - 1][vm.value].push(newItem);
                                    } catch (e) {
                                        params[params.length - 1][vm.value][0] = object;
                                    }
                                    break;
                                default:
                                    try {
                                        var newItem = JSON.parse($scope.valueItem);
                                        newItem[vm.valueKey] = object;
                                        params[params.length - 1][vm.value].push(newItem);
                                    } catch (e) {
                                        params[params.length - 1][vm.value] = object;
                                    }
                                    break;
                            }
                        }

                        function _format_array(object, indent_count, parent) {// json值字段为array
                            if (object.length > 0) {
                                format(object[0], indent_count + 1, parent)
                            }
                        }

                        function _format_object(object, indent_count, parent) {// json值字段为object
                            for (var key in object) {
                                try {
                                    var newItem = JSON.parse($scope.item);
                                } catch (e) {
                                    var newItem = {};
                                }
                                newItem[vm.key] = parent ? (parent + '>>' + key) : key;
                                params.push(newItem);
                                format(object[key], indent_count + 1, key)
                            }
                        }

                        function _typeof(object) {// json值字段类型判断函数
                            var tf = typeof object,
                                ts = _toString.call(object);
                            return null === object ? 'Null' :
                                'undefined' == tf ? 'Undefined' :
                                'boolean' == tf ? 'Boolean' :
                                'number' == tf ? 'Number' :
                                'string' == tf ? 'String' :
                                '[object Function]' == ts ? 'Function' :
                                '[object Array]' == ts ? 'Array' :
                                '[object Date]' == ts ? 'Date' : 'Object';
                        };
                        var _JSONFormat = function(origin_data) {// 主变量
                            // this.data = origin_data ? origin_data :
                            // JSON && JSON.parse ? JSON.parse(origin_data) : eval('(' + origin_data + ')');
                            try {
                                this.data = JSON.parse(origin_data);
                            } catch (e) {
                                this.data = {};
                            }
                        };

                        _JSONFormat.prototype = {// 主变量参数
                            constructor: JSONFormat,
                            toString: function() {// 主函数
                                format(this.data, 1);
                            }
                        }

                        return _JSONFormat;
                    })();
                    $scope.importJson = function() { // 插入返回参数集
                        vm.JsonToParamInputModel(function(data) {
                            if (data) {
                                new JSONFormat(data.desc, 4).toString();
                                switch (data.which) {
                                    case 0:
                                        { // 插入
                                            $scope.resetResult = $scope.resetResult.concat(params)
                                            break;
                                        }
                                    case 1:
                                        { // 替换
                                            $scope.resetResult = params;
                                            break;
                                        }
                                }
                                params=[];
                            }
                        });
                    }

                    // 弹窗调用
                    vm.JsonToParamInputModel = function openModel(callback) {
                        var modalInstance = $uibModal.open({
                            animation: true,
                            templateUrl: 'JsonToParamInputModel',
                            controller: 'JsonToParamInputModelCtrl',
                            resolve: {}
                        });
                        modalInstance.result.then(callback);
                    }
                }
            };
        }]);
})();
