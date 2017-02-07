(function() {
    /* 项目侧边栏指令 */
    angular.module('eolinker').directive('projectSidebar', ["$window", function($window, EVENT) {
        return {
            restrict: 'AE',
            templateUrl: 'app/page/project/sidebar/sidebar.html',
            // replace:true,
            scope: {
                isShrink: '=' // 是否收缩
            },
            controller: projectSidebarCtroller,
            controllerAs: 'projectSidebarCtrl'
        }
    }])

    projectSidebarCtroller.$inject = ['$scope', 'Api', '$state', 'CODE', '$uibModal', 'GroupService'];

    function projectSidebarCtroller($scope, Api, $state, CODE, $uibModal, GroupService) {
        var vm = this;
        var code = CODE.SUCCESS;
        vm.info = {
            projectID: $state.params.projectID,
            groupID: $state.params.groupID,
            childGroupID: $state.params.childGroupID,
            apiID: $state.params.apiID,
            tips: $state.params.search ? $state.params.search : '',
            state: $state.current.name.indexOf('api') > -1 ? 0 : 1, // 0:api;1:code;
            manualShrink: $scope.isShrink
        };
        vm.list = {
            api: [],
            code: []
        }
        vm.query = [];
        vm.apiGroup = null;
        vm.codeGroup = [];

        vm.staticQuery = [{ groupID: -1, groupName: "所有接口" }, { groupID: -2, groupName: "接口回收站" }];
        vm.staticCodeQuery = [{ groupID: -1, groupName: "所有状态码" }];
        vm.search = {
            isSpread: false,
            countDown: 1,
            time: ''
        }
        vm.group = {
            testIndex: 0
        }

        function init() { // 初始化接口文档/状态码文档侧边栏
            switch (vm.info.state) {
                case 0:
                // 接口文档
                    {
                        Api.Group.Query(vm.info).$promise.then(function(data) {
                            if (code == data.statusCode || data.statusCode == CODE.EMPTY) {
                                if (data.statusCode == CODE.EMPTY) {
                                    vm.query = vm.staticQuery;
                                } else {
                                    vm.apiGroup = data;
                                    vm.query = vm.staticQuery.concat(data.groupList);
                                }

                                if ($state.current.name.indexOf('edit') > -1) {
                                    GroupService.set(0, data, true);
                                } else {
                                    GroupService.set(0, data);
                                }
                                angular.forEach(vm.query, function(val, key) {
                                    if (val.groupID == vm.info.groupID) {
                                        val.isClick = true;
                                        if (vm.info.childGroupID) {
                                            for (var i = 0; i < val.childGroupList.length; i++) {
                                                if (val.childGroupList[i].groupID == vm.info.childGroupID) {
                                                    val.childGroupList[i].isClick = true;
                                                    // 向上传递事件，改变窗口文档标题
                                                    $scope.$emit('$windowTitle', { groupName: val.childGroupList[i].groupName });
                                                    break;
                                                }
                                            }
                                        } else {
                                            // 向上传递事件，改变窗口文档标题
                                            $scope.$emit('$windowTitle', { groupName: val.groupName });
                                        }
                                    }
                                })
                                vm.list.api = vm.query;
                            }
                        })
                        if ($state.current.name.indexOf('edit') > -1 && !$scope.isShrink) {
                            $scope.isShrink = true;
                        }
                        break;
                    }
                case 1:
                // 状态码文档
                    {
                        Api.CodeGroup.Query(vm.info).$promise.then(function(data) {
                            if (code == data.statusCode || data.statusCode == '180001') {
                                if (data.statusCode == code) {
                                    vm.codeGroup = data;
                                    vm.query = vm.staticCodeQuery.concat(data.groupList);
                                } else {
                                    vm.query = vm.staticCodeQuery;
                                }
                                GroupService.set(1, data);
                                angular.forEach(vm.query, function(val, key) {
                                    if (val.groupID == vm.info.groupID) {
                                        val.isClick = true;
                                        if (vm.info.childGroupID) {
                                            for (var i = 0; i < val.childGroupList.length; i++) {
                                                if (val.childGroupList[i].groupID == vm.info.childGroupID) {
                                                    val.childGroupList[i].isClick = true;
                                                    // 向上传递事件，改变窗口文档标题
                                                    $scope.$emit('$windowTitle', { groupName: val.childGroupList[i].groupName });
                                                    break;
                                                }
                                            }
                                        } else {
                                            // 向上传递事件，改变窗口文档标题
                                            $scope.$emit('$windowTitle', { groupName: val.groupName });
                                        }
                                    }
                                })
                                vm.list.code = vm.query;
                            }
                        })
                        break;
                    }
            }
        }
        init();

        vm.spreadUp = function() { // 展开侧边栏
            vm.search.isSpread = true;
        }
        vm.shrinkMouseLeave = function() { // 鼠标离开搜索栏事件
            if ($scope.isShrink) {
                vm.search.time = setInterval(function() {
                    vm.search.countDown--;
                    vm.search.isSpread = false;
                    clearInterval(vm.search.time);
                    vm.search.countdown = 1;
                    $scope.$digest(); // 通知视图模型的变化
                }, 1000);
            }
        }
        vm.shrinkMouseEnter = function() { // 鼠标进入搜索栏事件
            if ($scope.isShrink) {
                clearInterval(vm.search.time);
                vm.search.countdown = 1;
                vm.search.isSpread = true;
            }
        }
        vm.search = function() { // 搜索接口/状态码
            if ($scope.searchForm.$valid) {
                switch (vm.info.state) {
                    case 0:
                    //搜索接口
                        {
                            $state.go('project.api.list', { 'projectID': vm.info.projectID, 'search': vm.info.tips });
                            break;

                        }
                    case 1:
                    //搜索状态码
                        {
                            $state.go('project.code.list', { 'projectID': vm.info.projectID, 'search': vm.info.tips });
                            break;
                        }
                }
            }
        }
        vm.change = function(val) { // 切换接口文档/状态码文档
            switch (val) {
                case 0:
                // 切换接口文档
                    {
                        $state.go('project.api.list', { 'projectID': vm.info.projectID, 'groupID': -1, 'search': null });
                        break;
                    }
                case 1:
                // 状态码文档
                    {
                        $state.go('project.code.list', { 'projectID': vm.info.projectID, 'groupID': -1, 'search': null });
                        break;
                    }
            }
            vm.info.state = val;
            init();
        }
        vm.click = function(groupID, query, $index) { // 选中分组
            angular.forEach(vm.query, function(val, key) {
                val.isClick = false;
            });
            query.isClick = true;
            vm.info.groupID = groupID;
            switch (vm.info.state) {
                case 0:
                // 接口文档页面
                    {
                        if (groupID == -2) {
                            $state.go('project.api.trash', { 'projectID': vm.info.projectID, 'groupID': groupID, 'childGroupID': null });
                        } else {
                            $state.go('project.api.list', { 'projectID': vm.info.projectID, 'groupID': groupID, 'childGroupID': null, 'search': null });
                        }
                        break;
                    }
                case 1:
                // 状态码文档页面
                    {
                        $state.go('project.code.list', { 'projectID': vm.info.projectID, 'groupID': groupID, 'childGroupID': null, 'search': null });
                        break;
                    }
            }
        }
        vm.childClick = function(list, query) { // 选中子分组
            switch (vm.info.state) {
                case 0:
                // 接口文档页面
                    {
                        for (var i = 0; i < query.childGroupList.length; i++) {
                            var val = query.childGroupList[i];
                            if (val.isClick) {
                                val.isClick = false;
                                break;
                            }
                        }
                        list.isClick = true;
                        $state.go('project.api.list', { 'projectID': vm.info.projectID, 'groupID': vm.info.groupID, 'childGroupID': list.groupID, 'apiID': list.apiID, search: null });
                        break;
                    }
                case 1:
                // 状态码文档页面
                    {
                        for (var i = 0; i < query.childGroupList.length; i++) {
                            var val = query.childGroupList[i];
                            if (val.isClick) {
                                val.isClick = false;
                                break;
                            }
                        }
                        list.isClick = true;
                        $state.go('project.code.list', { 'projectID': vm.info.projectID, 'groupID': vm.info.groupID, 'childGroupID': list.groupID, 'apiID': list.apiID, search: null });
                        break;
                    }
            }
        }
        vm.edit = function(val) { // 修改/新增分组
            var title = '';
            var secondTitle = '';
            if (val) {
                title = '修改分组';
            } else {
                title = '新增分组';
            }
            secondTitle = '分组';
            vm.GroupModel(title, val, secondTitle, vm.info.projectID, function(info) {
                if (info) {
                    switch (vm.info.state) {
                        case 0:
                        // 接口文档页面
                            {
                                if (val) {
                                    Api.Group.Update(info).$promise.then(function(data) {
                                        if (code == data.statusCode) {
                                            vm.InfoModel(title + '成功', 'success');
                                            angular.forEach(vm.query, function(val, key) {
                                                if (val.groupID == info.groupID) {
                                                    val.groupName = info.groupName;
                                                }
                                            });
                                            GroupService.set(0, vm.apiGroup);
                                        }
                                    });
                                } else {
                                    Api.Group.Add(info).$promise.then(function(data) {
                                        if (code == data.statusCode) {
                                            vm.InfoModel(title + '成功', 'success');
                                            init();
                                        }
                                    });
                                }
                                break;
                            }
                        case 1:
                        // 状态码文档页面
                            {

                                if (val) {
                                    Api.CodeGroup.Update(info).$promise.then(function(data) {
                                        if (code == data.statusCode) {
                                            vm.InfoModel(title + '成功', 'success');
                                            angular.forEach(vm.query, function(val, key) {
                                                if (val.groupID == info.groupID) {
                                                    val.groupName = info.groupName;
                                                }
                                            });
                                            GroupService.set(1, vm.codeGroup);
                                        }
                                    });
                                } else {
                                    Api.CodeGroup.Add(info).$promise.then(function(data) {
                                        if (code == data.statusCode) {
                                            vm.InfoModel(title + '成功', 'success');
                                            init();
                                        }
                                    });
                                }
                                break;
                            }
                    }
                }
            });
        }
        vm.editChildGroup = function(query, list, isEidt) { // 修改/新增子分组
            var title = '';
            if (isEidt) {
                title = '修改子分组';
            } else {
                title = '新增子分组';
            }
            vm.GroupModel(title, list, '分组', vm.info.projectID, function(info) {
                if (info) {
                    switch (vm.info.state) {
                        case 0:
                        // 接口文档页面
                            {
                                if (isEidt) {
                                    Api.Group.Update(info).$promise.then(function(data) {
                                        if (code == data.statusCode) {
                                            vm.InfoModel(title + '成功', 'success');
                                            list.groupName = info.groupName;
                                            GroupService.set(0, vm.apiGroup);
                                        }
                                    });
                                } else {
                                    Api.Group.Add({ parentGroupID: query.groupID, projectID: vm.info.projectID, groupName: info.groupName }).$promise.then(function(data) {
                                        if (code == data.statusCode) {
                                            vm.InfoModel(title + '成功', 'success');
                                            init();
                                        }
                                    });
                                }
                                break;
                            }
                        case 1:
                        // 状态码文档页面
                            {

                                if (isEidt) {
                                    Api.CodeGroup.Update(info).$promise.then(function(data) {
                                        if (code == data.statusCode) {
                                            vm.InfoModel(title + '成功', 'success');
                                            list.groupName = info.groupName;
                                            GroupService.set(1, vm.codeGroup);
                                        }
                                    });
                                } else {
                                    Api.CodeGroup.Add({ parentGroupID: query.groupID, projectID: vm.info.projectID, groupName: info.groupName }).$promise.then(function(data) {
                                        if (code == data.statusCode) {
                                            vm.InfoModel(title + '成功', 'success');
                                            init();
                                        }
                                    });
                                }
                                break;
                            }
                    }
                }
            });
        }
        vm.delete = function(query, index) { // 删除分组
            var info = {
                title: '',
                message: ''
            }
            switch (vm.info.state) {
                case 0:
                // 接口文档页面
                    {
                        info = {
                            title: '删除分组',
                            message: '删除分组后，该分组下的api将不会移入接口回收站，该操作无法撤销，确认删除？'
                        };
                        break;
                    }
                case 1:
                // 状态码文档页面
                    {
                        info = {
                            title: '删除分组',
                            message: '请问是否删除该分组？'
                        };
                        break;
                    }
            }
            vm.EnsureModel(info.title, false, info.message, {}, function(data) {
                if (data) {
                    switch (vm.info.state) {
                        case 0:
                        // 接口文档页面
                            {

                                Api.Group.Delete({ groupID: query.groupID }).$promise.then(function(data) {
                                    if (data.statusCode == code) {
                                        vm.query.splice(index, 1);
                                        vm.InfoModel('分组删除成功', 'success');
                                        if (vm.query.length > 2) {
                                            vm.apiGroup.groupList.splice(index - 2, 1);
                                            GroupService.set(0, vm.apiGroup);
                                        } else {
                                            GroupService.set(0, null);
                                        }
                                        vm.click(-1, vm.query[0]);
                                    }
                                })
                                break;
                            }
                        case 1:
                        // 状态码文档页面
                            {
                                Api.CodeGroup.Delete({ groupID: query.groupID }).$promise.then(function(data) {
                                    if (data.statusCode == code) {
                                        vm.query.splice(index, 1);
                                        vm.InfoModel('分组删除成功', 'success');
                                        if (vm.query.length > 1) {
                                            vm.codeGroup.groupList.splice(index - 1, 1);
                                            GroupService.set(1, vm.codeGroup);
                                        } else {
                                            GroupService.set(1, null);
                                        }
                                        vm.click(-1, vm.query[0]);
                                    }
                                })
                                break;
                            }
                    }
                }
                vm.info.isFunction = false;
            });
        }
        vm.deleteChildGroup = function(query, list, index) { // 删除子分组
            var info = {
                title: '',
                message: ''
            }
            switch (vm.info.state) {
                case 0:
                // 接口文档页面
                    {
                        info = {
                            title: '删除分组',
                            message: '删除分组后，该分组下的api将不会移入接口回收站，该操作无法撤销，确认删除？'
                        };
                        break;
                    }
                case 1:
                // 状态码文档页面
                    {
                        info = {
                            title: '删除分组',
                            message: '请问是否删除该分组？'
                        };
                        break;
                    }
            }
            vm.EnsureModel(info.title, false, info.message, {}, function(data) {
                if (data) {
                    switch (vm.info.state) {
                        case 0:
                        // 接口文档页面
                            {

                                Api.Group.Delete({ groupID: list.groupID }).$promise.then(function(data) {
                                    if (data.statusCode == code) {
                                        query.childGroupList.splice(index, 1);
                                        vm.InfoModel('分组删除成功', 'success');
                                        vm.click(query.groupID, query);
                                    }
                                })
                                break;
                            }
                        case 1:
                        // 状态码文档页面
                            {
                                Api.CodeGroup.Delete({ groupID: list.groupID }).$promise.then(function(data) {
                                    if (data.statusCode == code) {
                                        query.childGroupList.splice(index, 1);
                                        vm.InfoModel('分组删除成功', 'success');
                                        vm.click(query.groupID, query);
                                    }
                                })
                                break;
                            }
                    }
                }
                vm.info.isFunction = false;
            });
        }
        $scope.$on('$stateChangeSuccess', function() {// 当路由改变时更新视图
            if ($state.current.name.indexOf('code') > -1) {
                vm.info.state = 1;
                vm.query = vm.list.code;
                vm.info.childGroupID = $state.params.childGroupID;
            } else {
                vm.info.state = 0;
                vm.query = vm.list.api;
                vm.info.childGroupID = $state.params.childGroupID;
            }
            if ($state.current.name.indexOf('edit') > -1) {
                $scope.isShrink = true;
            } else {
                if (!vm.info.manualShrink) {
                    $scope.isShrink = false;
                }
            }
            vm.info.groupID = $state.params.groupID;
            if (vm.info.state == 1) {
                angular.forEach(vm.query, function(val, key) {
                    if (val.groupID == $state.params.groupID) {
                        if ($state.current.name.indexOf('list') > -1) {
                            // 向上传递事件，改变窗口文档标题
                            $scope.$emit('$windowTitle', { groupName: val.groupName });
                        }
                        if (vm.info.groupID > 0 && !vm.info.childGroupID) {
                            for (var i = 0; i < val.childGroupList.length; i++) {
                                if (val.childGroupList[i].isClick) {
                                    val.childGroupList[i].isClick = false;
                                    break;
                                }
                            }
                        }
                        val.isClick = true;
                    } else {
                        val.isClick = false;
                    }
                });
            } else {
                angular.forEach(vm.query, function(val, key) {
                    if (val.groupID == $state.params.groupID) {
                        if ($state.current.name.indexOf('list') > -1||$state.current.name.indexOf('trash') > -1) {
                            // 向上传递事件，改变窗口文档标题
                            $scope.$emit('$windowTitle', { groupName: val.groupName });
                        }
                        if (vm.info.groupID > 0) {
                            if (!vm.info.childGroupID) {
                                for (var i = 0; i < val.childGroupList.length; i++) {
                                    if (val.childGroupList[i].isClick) {
                                        val.childGroupList[i].isClick = false;
                                        break;
                                    }
                                }
                            } else {
                                var isFirstOk = false;
                                for (var i = 0; i < val.childGroupList.length; i++) {
                                    if (val.childGroupList[i].isClick) {
                                        val.childGroupList[i].isClick = false;
                                        if (isFirstOk) {
                                            break;
                                        }
                                        isFirstOk = true;
                                    }
                                    if (val.childGroupList[i].groupID == vm.info.childGroupID) {
                                        val.childGroupList[i].isClick = true;
                                        if (isFirstOk) {
                                            break;
                                        }
                                        isFirstOk = true;
                                    }
                                }
                            }
                        }
                        val.isClick = true;
                    } else {
                        val.isClick = false;
                    }
                });
            }
        })

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
        vm.GroupModel = function openModel(title, info, secondTitle, projectID, callback) {
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'GroupModel',
                controller: 'GroupModelCtrl',
                resolve: {
                    title: function() {
                        return title;
                    },
                    info: function() {
                        return info;
                    },
                    projectID: function() {
                        return projectID;
                    },
                    secondTitle: function() {
                        return secondTitle;
                    }
                }
            });
            modalInstance.result.then(callback);
        }
        vm.EnsureModel = function openModel(title, necessity, info, btn, callback) {
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
                    },
                    btn: function() {
                        return btn;
                    }
                }
            });
            modalInstance.result.then(callback);
        }
    }

})();
