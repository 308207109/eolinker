(function() {
    'use strict';

    angular.module('eolinker')
    /* 分组状态信息服务定义 */
    .factory('GroupService', GroupFactory);

    GroupFactory.$inject = ['$rootScope']

    function GroupFactory($rootScope) { // which 0：api分组 1：code分组
        var apiGroup;
        var codeGroup;
        return {
            get: function(which) {// 获取函数
                var group;
                switch (which) {
                    case 0:
                        {
                            group = apiGroup;
                            break;
                        }
                    case 1:
                        {
                            group = codeGroup;
                            break;
                        }
                }
                return group;
            },
            set: function(which, data, boolean) {// 设置函数
                switch (which) {
                    case 0:
                        {
                            apiGroup = data;
                            if (boolean) {
                                $rootScope.$broadcast('$sidebarFinish');
                            }
                            break;
                        }
                    case 1:
                        {
                            codeGroup = data;
                            break;
                        }
                }
            }
        };
    }
})();
