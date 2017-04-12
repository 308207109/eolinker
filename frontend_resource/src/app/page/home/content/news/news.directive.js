(function() {
    /* 消息提醒指令 */
    angular.module('eolinker').directive('homeNews', ['$timeout', "$window", function($timeout, $window, EVENT) {
        return {
            restrict: 'AE',
            templateUrl: 'app/page/home/content/news/news.html',
            // replace:true,
            controller: homeNewsCtroller,
            controllerAs: 'homeNewsCtrl'
        }
    }])

    homeNewsCtroller.$inject = ['$scope', 'Api', '$state', 'CODE', '$uibModal', '$rootScope', '$timeout', '$sce', '$filter'];

    function homeNewsCtroller($scope, Api, $state, CODE, $uibModal, $rootScope, $timeout, $sce, $filter) {
        var vm = this;
        var code = CODE.SUCCESS;
        vm.info = {
            pages: '',
            maxSize: 5,
            pageSize: 15,
            page: 1,
            msgCount: 0,
            jumpPage: ""
        };
        vm.query = [];
        vm.loadingIsEnd = true;

        function init() { // 初始化消息页面
            vm.loadingIsEnd = false;
            Api.News.Query({ page: vm.info.page }).$promise.then(function(data) {
                vm.loadingIsEnd = true;
                if (data.statusCode == code) {
                    vm.query = data.messageList;
                    angular.forEach(vm.query, function(val, key) {
                        val.msg = $sce.trustAsHtml($filter('XssFilter')(val.msg, { whiteList: { b: ['style'], p: [] } }));
                    });
                    vm.info.pages = data.pageCount;
                    vm.info.msgCount = data.msgCount;
                } else {
                    vm.query = [];
                }
            })
        }
        var timer = $timeout(function() {
            init();
        });
        vm.pageChanged = function() { // 跳转页面
            init();
        }
        vm.clean = function() { // “清空消息”按钮
            vm.EnsureModel('清空消息', false, '确认清空？', function(data) {
                if (data) {
                    Api.News.Clean().$promise.then(function(data) {
                        if (data.statusCode == code) {
                            vm.InfoModel('消息清空成功', 'success');
                            init();
                            $rootScope.$emit('$newsClean'); // 向上传递事件，消息清空
                        }
                    })
                }
            });
        }
        vm.read = function(query, index) { // 阅读消息
            query.isClick = !query.isClick;
            if (query.isRead != 1) {
                Api.News.Read({ 'msgID': query.msgID }).$promise.then(function(data) {
                    if (data.statusCode == code) {
                        query.isRead = 1;
                        $rootScope.$emit('$newsRead'); // 向上传递事件，阅读一条未读消息
                    }
                })
            }
        }
        vm.delete = function(msgID, index) { // “清空消息”按钮，打开清空消息弹窗
            vm.EnsureModel('删除消息', false, '确认删除？', function(data) {
                if (data) {
                    Api.News.Delete({ 'msgID': msgID }).$promise.then(function(data) {
                        if (data.statusCode == code) {
                            vm.query.splice(index, 1);
                            vm.InfoModel('消息删除成功', 'success');
                        }
                    })
                }
            });
        }
        $scope.$on('$destroy', function() { // 页面跳转触发事件
            if (timer) {
                $timeout.cancel(timer);
            }
        });

        //弹窗引用
        vm.InfoModel = function openModel(info, type, callback) {
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

        vm.EnsureModel = function openModel(title, necessity, info, callback) {
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'EnsureModel',
                controller: 'EnsureModelCtrl',
                resolve: {
                    title: function() {
                        return title;
                    },
                    necessity: function() {
                        return necessity;
                    },
                    info: function() {
                        return info;
                    }
                }
            });
            modalInstance.result.then(callback);
        }
    }

})();
