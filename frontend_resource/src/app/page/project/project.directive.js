(function() {
    /* 项目内页容器指令 */
    angular.module('eolinker').directive('project', ['$timeout', "$window", function($timeout, $window, EVENT) {
        return {
            restrict: 'AE',
            templateUrl: 'app/page/project/project.html',
            // replace:true,
            controller: projectPage,
            controllerAs: 'projectCtrl'
        }
    }])

    projectPage.$inject = ['$scope', '$timeout', 'Api', '$state', 'CODE', '$cookies', '$uibModal','TitleService'];

    function projectPage($scope, $timeout, Api, $state, CODE, $cookies, $uibModal,TitleService) {

        var vm = this;
        var code = CODE.SUCCESS;
        var constantTitle = TitleService.get();
        vm.info = {
            constantTitle: constantTitle||'eolinker开源版',
            apiName: '',
            groupName: '',
            projectName: ''
        };
        vm.project = {
            projectName: '',
            projectType: -1,
            isFunction: false
        }

        function init() {
            var projectID = $state.params.projectID
            try {
                vm.query = JSON.parse(window.localStorage['PROJECT']);
                vm.info.projectName = vm.query.projectName;
            } catch (e) {
                Api.Project.Query(vm.project).$promise.then(function(data) {
                    if (data.statusCode == code) {
                        vm.query = data.projectList;
                        vm.info.projectName = vm.query.projectName;
                        window.localStorage.setItem('PROJECT', JSON.stringify(data.projectList));
                    }
                })
            }
        }
        init();
        $scope.$on('$windowTitle', function(data, attr) {// 更新窗口文档标题
            if (attr) {
                if (attr.apiName) {
                    vm.info.apiName = attr.apiName;
                    window.document.title = attr.apiName + ' - ' + vm.info.projectName + ' - '+ vm.info.constantTitle;
                } else {
                    vm.info.groupName = attr.groupName;
                    window.document.title = attr.groupName + ' - ' + vm.info.projectName + ' - '+ vm.info.constantTitle;
                }
            } else {
                if (vm.info.groupName) {
                    window.document.title = vm.info.groupName + ' - ' + vm.info.projectName + ' - '+ vm.info.constantTitle;
                } else {
                    window.document.title = vm.info.projectName + ' - '+ vm.info.constantTitle;
                }
            }
        });
        $scope.$on('$transferStation', function(data, attr) { //attr.state:0 initSidebar,1:changeSidebar
            $scope.$broadcast(attr.state, attr.data);
        });
    }

})();
