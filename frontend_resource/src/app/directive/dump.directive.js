(function() {
    'use strict';

    angular.module('eolinker.directive')
        /* 项目导出指令 */
        .directive('dumpDirective', ['Api', '$uibModal', 'CODE', function(Api, $uibModal, CODE) {
            return {
                restrict: 'A',
                scope: {
                    projectId: '@'// 项目ID
                },
                link: function($scope, elem, attrs, ctrl) {
                    var code = CODE.SUCCESS;

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
                    elem.bind('click', function(event) {// 导出函数
                        Api.Project.Dump({ projectID: $scope.projectId }).$promise.then(function(data) {
                            if (code == data.statusCode) {
                                var dumpBtn = document.getElementById('dump_js');
                                dumpBtn.href = './server/dump/' + data.fileName;
                                dumpBtn.download = data.fileName;
                                dumpBtn.click();
                            } else {
                                vm.InfoModel('导出失败', 'error');
                            }
                        })
                    })
                }
            };
        }]);
})();
