(function() {
    /* 编辑接口指令 */
    angular.module('eolinker').directive('projectApiEdit', ['$timeout', "$window", function($timeout, $window, EVENT) {
        return {
            restrict: 'AE',
            templateUrl: 'app/page/project/content/api/edit/edit.html',
            // replace:true,
            controller: projectApiEditCtroller,
            controllerAs: 'projectApiEditCtrl'
        }
    }])

    projectApiEditCtroller.$inject = ['$scope', 'Api', '$state', '$window', 'CODE', '$uibModal', '$rootScope', 'GroupService'];

    function projectApiEditCtroller($scope, Api, $state, $window, CODE, $uibModal, $rootScope, GroupService) {
        var vm = this;
        var code = CODE.SUCCESS;
        vm.group = [];
        vm.childGroupList = [{ groupID: -1, groupName: '可选[二级菜单]' }];
        var initChildGroup = [{ groupID: -1, groupName: '可选[二级菜单]' }];
        var apiGroup = [];

        vm.info = {
            projectID: $state.params.projectID,
            childGroupID: $state.params.childGroupID,
            groupID: $state.params.groupID,
            apiID: $state.params.apiID
        }
        vm.soft = {
            requestParamForm: {
                containment: '.request-form-ul',
                child: {
                    containment: '.request-param-form-ul'
                }
            },
            headerForm: {
                containment: '.header-form-ul'
            },
            responseParamForm: {
                containment: '.response-form-ul',
                child: {
                    containment: '.response-param-form-ul'
                }
            }
        }
        vm.detail = {
            projectID: $state.params.projectID,
            groupID: $state.params.groupID,
            childGroupID: $state.params.childGroupID,
            apiID: $state.params.apiID,
            apiRichNote: '',
            apiMarkdownNote: '',
            apiNoteRaw: '',
            apiNoteType: '0',
            apiRequestParamType: '0',
            apiRequestRaw: '',
            apiHeader: [],
            apiRequestParam: [],
            apiResultParam: [],
            starred: 0
        };
        vm.template = {// 自动匹配json获取response params
            resultItem: {
                "paramNotNull": "0",
                "paramName": "",
                "paramKey": "",
                "paramValueList": []
            },
            resultValueItem:{
                "value": "",
                "valueDescription": ""
            }
        }
        var isMarkInit = false;
        vm.loadingIsEnd = true;


        vm.requestHeaderArray = [
            'Accept', 'Accept-Charset', 'Accept-Encoding', 'Accept-Language', 'Accept-Ranges', 'Authorization',
            'Cache-Control', 'Connection', 'Cookie', 'Content-Length', 'Content-Type',
            'Date',
            'Expect',
            'From',
            'Host',
            'If-Match', 'If-Modified-Since', 'If-None-Match', 'If-Range', 'If-Unmodified-Since',
            'Max-Forwards',
            'Pragma', 'Proxy-Authorization',
            'Range', 'Referer',
            'TE',
            'Upgrade', 'User-Agent',
            'Via',
            'Warning'
        ];
        vm.requestParamLimitArray = [
            '11位中国大陆手机号',
            '纯数字',
            '纯英文字母',
            '数字、英文',
            '数字、英文、下划线',
            '数字、英文、特殊符号',
            '非中文字符',
            '邮箱地址'
        ];
        var initMessage = function() { // 初始化分组信息
            var apiGroup = GroupService.get(0);
            vm.group = apiGroup.groupList;
            if (vm.info.groupID > 0) {
                for (var i = 0; i < vm.group.length; i++) {
                    var val = vm.group[i];
                    if (val.groupID == vm.info.groupID) {
                        vm.childGroupList = initChildGroup.concat(val.childGroupList);
                        break;
                    }
                }
            } else {
                vm.childGroupList = initChildGroup.concat(vm.group[0].childGroupList);
            }
            if (vm.detail.apiID || vm.detail.groupID > 0) {
                vm.detail.groupID = parseInt(vm.detail.groupID);
                if (vm.info.childGroupID) {
                    vm.detail.childGroupID = parseInt(vm.detail.childGroupID);
                } else {
                    vm.detail.childGroupID = -1;
                }
            } else {
                vm.detail.groupID = vm.group[0].groupID;
                vm.detail.childGroupID = -1;
            }
        }

        function init() { // 初始化编辑接口页面
            vm.loadingIsEnd = false;
            initMessage();
            if (vm.detail.apiID) { // 修改接口
                Api.Api.Detail({
                    apiID: vm.info.apiID,
                    groupID: vm.info.childGroupID ? vm.info.childGroupID : vm.info.groupID,
                    projectID: vm.info.projectID
                }).$promise.then(function(data) {
                    vm.loadingIsEnd = true;
                    if (code == data.statusCode) {
                        vm.detail = data.apiInfo.baseInfo;
                        vm.detail.apiHeader = data.apiInfo.headerInfo;
                        vm.detail.apiRequestParam = data.apiInfo.requestInfo;
                        vm.detail.apiResultParam = data.apiInfo.resultInfo;
                        vm.detail.apiStatus = "" + vm.detail.apiStatus;
                        vm.detail.apiProtocol = "" + vm.detail.apiProtocol;
                        vm.detail.apiRequestType = "" + vm.detail.apiRequestType;
                        // vm.detail.apiSuccessMockType = "" + vm.detail.apiSuccessMockType;
                        // vm.detail.apiFailureMockType = "" + vm.detail.apiFailureMockType;
                        vm.detail.apiRequestParamType = "" + vm.detail.apiRequestParamType;
                        vm.detail.apiNoteType = "" + vm.detail.apiNoteType;
                        vm.detail.apiRichNote = vm.detail.apiNoteType == 0 ? vm.detail.apiNote : '';
                        $scope.$emit('$windowTitle', { apiName: vm.info.apiID ? (vm.info.type ? '[另存为]' + vm.detail.apiName : '[修改]' + vm.detail.apiName) : '[新增接口]' });
                        if (!!vm.detail.parentGroupID) {
                            vm.detail.childGroupID = data.apiInfo.baseInfo.groupID;
                            vm.detail.groupID = vm.detail.parentGroupID;
                            angular.forEach(vm.group, function(val, key) {
                                if(vm.detail.groupID==val.groupID){
                                    vm.childGroupList = initChildGroup.concat(val.childGroupList);
                                }
                            });
                        } else {
                            vm.detail.childGroupID = -1;
                        }
                        if (vm.detail.apiNoteType == '1') {
                            isMarkInit = true;
                            $scope.$broadcast('$changeApiNoteType');
                        }
                        angular.forEach(vm.detail.apiRequestParam, function(val, key) {
                            val.paramNotNull = "" + val.paramNotNull;
                            val.paramType = "" + val.paramType;
                            val.paramValueList = val.paramValueList;
                        });
                        angular.forEach(vm.detail.apiResultParam, function(val, key) {
                            val.paramNotNull = "" + val.paramNotNull;
                            val.paramValueList = val.paramValueList;
                        })
                    }
                });
            } else { // 新增接口
                $scope.$emit('$windowTitle', { apiName: '[新增接口]' });
                vm.loadingIsEnd = true;
                vm.detail.apiStatus = '0';
                vm.detail.apiProtocol = '0';
                vm.detail.apiRequestType = '0';
                // vm.detail.apiSuccessMockType = '0';
                // vm.detail.apiFailureMockType = '0';
                vm.detail.apiRequestParamType = '0';
                vm.detail.apiNoteType = '0';
            }

        }
        var checkInitStatus = function() { // 确定初始化状态
            if (!!GroupService.get(0)) {
                init();
            }
        }
        checkInitStatus();
        vm.changeChildGroup = function() { // 切换分组时更新其子分组
            for (var i = 0; i < vm.group.length; i++) {
                var val = vm.group[i];
                if (val.groupID == vm.detail.groupID) {
                    vm.childGroupList = initChildGroup.concat(val.childGroupList);
                    vm.detail.childGroupID = -1;
                    break;
                }
            }
        }
        vm.changeNoteType = function() { // 修改备注编辑器类型
            if (!isMarkInit) {
                isMarkInit = true;
                $rootScope.$broadcast('$changeApiNoteType');
            }
        }
        vm.changeMockStatus = function() { // 切换成功/失败结果
            vm.isSuccess = !vm.isSuccess;
        }
        vm.storage = function() { // 添加/移除星标
            switch (vm.detail.starred) {
                case 0:
                case '0':
                default:
                // 添加星标
                    {
                        vm.detail.starred = 1;
                        break;
                    }
                case 1:
                case '1':
                // 移除星标
                    {
                        vm.detail.starred = 0;
                        break;
                    }
            }
        }
        vm.addHeaderList = function() { // 添加请求头部
            var info = {
                "headerName": '',
                "headerValue": ''
            }
            vm.detail.apiHeader.push(info);
        }
        vm.deleteHeaderList = function(index) { // 删除请求头部
            vm.detail.apiHeader.splice(index, 1);
        }
        vm.addRequestList = function() { // 添加请求参数
            var info = {
                "paramNotNull": '0',
                "paramType": '0',
                "paramName": "",
                "paramKey": "",
                "paramValue": "",
                "paramLimit": "",
                "paramNote": "",
                "paramValueList": [],
                "default": 0
            }
            vm.addRequestParamList(info);
            vm.detail.apiRequestParam.push(info);
            vm.submited = false;
        }
        vm.deleteRequestList = function(index) { // 删除请求参数
            vm.detail.apiRequestParam.splice(index, 1);
        }
        vm.addRequestParamList = function(query) { // 添加请求参数值可能性
            var info = {
                "value": "",
                "valueDescription": ""
            };
            query.paramValueList.push(info);
        }
        vm.deleteRequestParamList = function(query, index) { // 删除请求参数值可能性
            query.paramValueList.splice(index, 1);
            if (index < query.default) {
                query.default--;
            } else if (index == query.default) {
                query.default = -1;
            }
        }
        vm.addResultList = function() { // 添加返回说明
            var info = {
                "paramNotNull": '0',
                "paramName": "",
                "paramKey": "",
                "paramValueList": []
            }
            vm.addResultParamList(info);
            vm.detail.apiResultParam.push(info);
            vm.submited = false;
        }
        vm.deleteResultList = function(index) { // 删除返回说明
            vm.detail.apiResultParam.splice(index, 1);
        }
        vm.addResultParamList = function(query) { // 添加返回说明值可能性
            var info = {
                "value": "",
                "valueDescription": ""
            };
            query.paramValueList.push(info);
        }
        vm.deleteResultParamList = function(query, index) { // 删除返回说明值可能性
            query.paramValueList.splice(index, 1);
        }
        vm.back = function() { // 跳转接口详情
            if (vm.detail.apiID) {
                $state.go('project.api.detail', { 'projectID': vm.detail.projectID, 'groupID': vm.info.groupID, 'apiID': vm.info.apiID });
            } else {
                $state.go('project.api.list', { 'projectID': vm.detail.projectID, 'groupID': vm.info.groupID });

            }
        }
        vm.changeRequestType = function() { // 切换请求类型(表单/源数据)
            if (vm.detail.apiRequestType != 0) {
                vm.detail.apiRequestParamType = 0;
            }
        }
        var save = function() { // 提交表单数据
            var info = {
                projectID: vm.detail.projectID,
                groupID: vm.detail.childGroupID > 0 ? vm.detail.childGroupID : vm.detail.groupID,
                apiID: vm.detail.apiID,
                apiRequestParam: '',
                apiResultParam: '',
                starred: vm.detail.starred,
                apiStatus: vm.detail.apiStatus,
                apiProtocol: vm.detail.apiProtocol,
                apiRequestType: vm.detail.apiRequestType,
                apiSuccessMockType: 0,
                apiFailureMockType: 0,
                apiURI: vm.detail.apiURI,
                apiName: vm.detail.apiName,
                apiSuccessMock: vm.detail.apiSuccessMock,
                apiFailureMock: vm.detail.apiFailureMock,
                apiHeader: vm.detail.apiHeader,
                apiNote: vm.detail.apiNoteType == '1' ? vm.detail.apiMarkdownNote : vm.detail.apiRichNote,
                apiNoteRaw: vm.detail.apiNoteRaw,
                apiNoteType: vm.detail.apiNoteType,
                apiRequestParamType: vm.detail.apiRequestParamType,
                apiRequestRaw: vm.detail.apiRequestRaw
            }
            var template = {
                apiRequestParam: vm.detail.apiRequestParam,
                apiResultParam: vm.detail.apiResultParam,
                apiHeader: vm.detail.apiHeader
            };
            var i = 0,
                j = 0;
            vm.check = false;
            for (i = template.apiHeader.length - 1; i >= 0; i--) { //请求头部
                if (!template.apiHeader[i].headerName) {
                    if (!template.apiHeader[i].headerValue) {
                        vm.detail.apiHeader.splice(i, 1);
                    } else {
                        vm.check = true;
                    }
                }
            }
            for (i = 0; i < vm.detail.apiRequestParam.length; i++) { //请求参数
                if (!vm.detail.apiRequestParam[i].paramKey) {
                    if (vm.detail.apiRequestParam[i].paramName && vm.detail.apiRequestParam[i].paramLimit && vm.detail.apiRequestParam[i].paramValue) {
                        angular.forEach(vm.detail.apiRequestParam[i].paramValueList, function(val, key) {
                            if (val.value || val.valueDescription) {
                                vm.check = true;
                                vm.detail.apiRequestParam[i].check = true;
                            } else {
                                vm.detail.apiRequestParam[i].check = false;
                            }
                        });
                        if (!vm.detail.apiRequestParam[i].check) {
                            if (template.apiRequestParam[i].paramValueList.length == 0) {
                                template.apiRequestParam.splice(i, 1);
                                i--;
                            } else {
                                for (j = template.apiRequestParam[i].paramValueList.length - 1; j >= 0; j--) {
                                    if (!template.apiRequestParam[i].paramValueList[j].value && !template.apiRequestParam[i].paramValueList[j].valueDescription) {
                                        template.apiRequestParam.splice(i, 1);
                                        i--;
                                        break;
                                    }
                                }
                            }
                        }
                    } else {
                        template.apiRequestParam.splice(i, 1);
                        vm.check = false;
                        i--;
                    }
                } else {
                    for (var key = 0; key < vm.detail.apiRequestParam[i].paramValueList.length; key++) {
                        var val = vm.detail.apiRequestParam[i].paramValueList[key];
                        if ((!val.value) && (!val.valueDescription)) {
                            vm.detail.apiRequestParam[i].paramValueList.splice(key, 1);
                            key--;
                        } else if (val.valueDescription && (!val.value)) {
                            vm.check = true;
                        }
                    }
                }
            }
            for (i = 0; i < vm.detail.apiResultParam.length; i++) { //返回说明
                if (!vm.detail.apiResultParam[i].paramKey) {
                    angular.forEach(vm.detail.apiResultParam[i].paramValue, function(val, key) {
                        if (val.value || val.valueDescription) {
                            vm.check = true;
                            vm.detail.apiResultParam[i].check = true;
                        } else {
                            vm.detail.apiResultParam[i].check = false;
                        }
                    });
                    if (!vm.detail.apiResultParam[i].check) {
                        if (template.apiResultParam[i].paramValueList.length == 0) {
                            template.apiResultParam.splice(i, 1);
                            i--;
                        } else {
                            for (j = template.apiResultParam[i].paramValueList.length - 1; j >= 0; j--) {
                                if (!template.apiResultParam[i].paramValueList[j].value && !template.apiResultParam[i].paramValueList[j].valueDescription) {
                                    template.apiResultParam.splice(i, 1);
                                    i--;
                                    break;
                                }
                            }
                        }

                    }
                } else {
                    for (var key = 0; key < vm.detail.apiResultParam[i].paramValueList.length; key++) {
                        var val = vm.detail.apiResultParam[i].paramValueList[key];
                        if ((!val.value) && (!val.valueDescription)) {
                            vm.detail.apiResultParam[i].paramValueList.splice(key, 1);
                            key--;
                        } else if (val.valueDescription && (!val.value)) {
                            vm.check = true;
                        }
                    }
                }
            }
            info.apiHeader = JSON.stringify(template.apiHeader);
            info.apiRequestParam = JSON.stringify(template.apiRequestParam);
            info.apiResultParam = JSON.stringify(template.apiResultParam);
            return info;
        }
        vm.keep = function() { // 继续添加
            var info = save();
            if ($scope.editForm.$valid && !vm.check) {
                vm.isDisable = true;
                vm.loadingIsEnd = false;
                Api.Api.Add(info).$promise.then(function(data) {
                    vm.isDisable = false;
                    vm.loadingIsEnd = true;
                    if (data.statusCode == code) {
                        $scope.$emit('$numChange',0)
                        vm.InfoModel('Api添加成功', 'success');
                        vm.detail = {
                            projectID: vm.info.projectID,
                            groupID: vm.info.groupID == '-1' ? vm.group[0].groupID : parseInt(vm.info.groupID),
                            apiHeader: [],
                            apiRequestParam: [],
                            apiResultParam: [],
                            starred: 0
                        };
                        if (vm.info.groupID > 0) {
                            for (var i = 0; i < vm.group.length; i++) {
                                var val = vm.group[i];
                                if (val.groupID == vm.info.groupID) {
                                    vm.childGroupList = initChildGroup.concat(val.childGroupList);
                                    break;
                                }
                            }
                        } else {
                            vm.childGroupList = initChildGroup.concat(vm.group[0].childGroupList);
                        }
                        if (vm.info.childGroupID) {
                            vm.detail.childGroupID = parseInt(vm.info.childGroupID);
                        } else {
                            vm.detail.childGroupID = -1;
                        }
                        vm.detail.apiStatus = '0';
                        vm.detail.apiProtocol = '0';
                        vm.detail.apiRequestType = '0';
                        // vm.detail.apiSuccessMockType = "0";
                        // vm.detail.apiFailureMockType = "0";
                        vm.detail.apiRequestParamType = "0";
                        vm.detail.apiNoteType = "0";
                        vm.submited = false;
                        window.scrollTo(0, 0);
                    }
                })
            } else {
                vm.InfoModel('Api编辑失败，请检查信息是否填写完整！', 'error');
                vm.submited = true;
            }
        }
        vm.edit = function() { // 保存修改
            var info = save();
            if ($scope.editForm.$valid && !vm.check) {
                if (vm.detail.apiID && $state.params.type != 2) {
                    vm.loadingIsEnd = false;
                    Api.Api.Update(info).$promise.then(function(data) {
                        vm.isDisable = false;
                        if (data.statusCode == code) {
                            $state.go('project.api.detail', { 'projectID': vm.detail.projectID, 'groupID': vm.info.groupID, 'childGroupID': vm.info.childGroupID, 'apiID': vm.info.apiID });
                            vm.InfoModel('Api修改成功', 'success');
                        }
                    })

                } else {
                    vm.isDisable = true;
                    vm.loadingIsEnd = false;
                    Api.Api.Add(info).$promise.then(function(data) {
                        vm.isDisable = false;
                        $scope.$emit('$numChange',0)
                        vm.loadingIsEnd = true;
                        if (data.statusCode == code) {
                            $state.go('project.api.detail', { 'projectID': vm.detail.projectID, 'groupID': vm.info.groupID, 'childGroupID': vm.info.childGroupID, 'apiID': data.apiID });
                            vm.InfoModel('Api添加成功', 'success');
                        }
                    })
                }
            } else {
                vm.InfoModel('Api编辑失败，请检查信息是否填写完整！', 'error');
                vm.submited = true;
            }
        }

        $scope.$on('$sidebarFinish', function() { // 侧边栏加载完毕事件
            init();
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
    }

})();
