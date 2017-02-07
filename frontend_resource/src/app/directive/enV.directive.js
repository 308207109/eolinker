(function() {
    'use strict';

    angular.module('eolinker.directive')
        /* 环境变量指令 */
        .directive('enV', ['$timeout', '$uibModal', 'Api', '$state', 'CODE', 'EnvService', function($timeout, $uibModal, Api, $state, CODE, EnvService) {
            return {
                restrict: 'A',
                transclude: true,
                replace: true,
                template: '<li class="pull-right en-v-li"  ng-mouseleave="isShow=false"><ul>' +
                    '<li class="child-input-li"  data-ng-click="isShow=true">' +
                    '<input class="eo-input" placeholder="没有测试环境" type="text" data-ng-model="isModel.envName" readonly>' +
                    '<label class="iconfont icon-triangledownfill" style="color:#333;"></label>' +
                    '</li>' +
                    '<li class="absolute enV-child-li" ng-class="{hidden:!isShow}">' +
                    '<ul class="message-ul">' +
                    '<li class="center-li" data-ng-click="manageEnV()">管理测试环境</li>' +
                    '<li class="list-li" data-ng-click="isClick(null)">无测试环境</li>' +
                    '<li class="list-li" data-ng-repeat="query in envQuery" data-ng-click="isClick(query)">' +
                    '{{query.envName}}' +
                    '</li>' +
                    '</ul>' +
                    '</li>' +
                    '</ul></li>',
                scope: {
                    isTest: '=', // 测试页面测试地址
                    isEnvUri: '=' // 当前环境变量
                },
                link: function($scope, elem, attrs, ctrl) {
                    $scope.envQuery = [];
                    $scope.isModel = {};
                    $scope.isShow = false;
                    var initTest = '';
                    var code = CODE.SUCCESS;
                    var init = function() { // 初始化环境变量
                        if (!!$scope.isTest) {
                            initTest = $scope.isTest;
                        }
                        $scope.isModel = EnvService.get();
                        Api.Env.Query({ projectID: $state.params.projectID }).$promise.then(function(data) {
                            if (code == data.statusCode) {
                                $scope.envQuery = data.envList;
                                if (!!$scope.isModel) {
                                    angular.forEach($scope.envQuery, function(val, key) {
                                        if ($scope.isModel.envID == val.envID) {
                                            $scope.isEnvUri = val.envURI;
                                            if ($scope.isTest) {
                                                $scope.isTest = val.envURI + initTest;
                                            }
                                        }
                                    })
                                }
                            }
                        })
                    }
                    var timer = $timeout(function() {
                        init();
                    });
                    $scope.$on('$destroy', function() { // 页面跳转触发事件
                        if (timer) {
                            $timeout.cancel(timer);
                        }
                    });
                    $scope.isClick = function(query) { // 选中当前环境变量
                        angular.forEach($scope.envQuery, function(val, key) {
                            val.isSelected = false;
                        })
                        if (query == null) {
                            query = {
                                envName: '',
                                envURI: ''
                            }
                            EnvService.set(null);
                        } else {
                            query.isSelected = true;
                            EnvService.set(query);
                        }
                        $scope.isModel = query;
                        $scope.isEnvUri = query.envURI;
                        $scope.isShow = false;
                        if ($scope.isTest) {
                            $scope.isTest = query.envURI + initTest;
                        }
                    }
                    $scope.manageEnV = function() { // 打开管理测试环境弹窗
                        $scope.EnVModel('管理测试环境', $scope.envQuery, function(data) {
                            if (!!$scope.isModel) {
                                $scope.isEnvUri = $scope.isModel.envURI;
                                if (!!$scope.isTest) {
                                    $scope.isTest = $scope.isModel.envURI + initTest;
                                }
                            }
                        });
                    }

                    //弹窗引用
                    $scope.EnVModel = function openModel(title, info, callback) {
                        var modalInstance = $uibModal.open({
                            animation: true,
                            templateUrl: 'EnVModel',
                            controller: 'EnVModelCtrl',
                            resolve: {
                                title: function() {
                                    return title;
                                },
                                info: function() {
                                    return info;
                                }
                            }
                        });
                        modalInstance.result.then(callback);
                    }
                }
            };
        }]);
})();
