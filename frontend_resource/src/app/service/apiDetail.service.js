(function() {
    'use strict';
    /* api详情信息服务定义 */
    angular.module('eolinker')
        .factory('ApiDetailService', ApiDetailFactory);

    ApiDetailFactory.$inject = []

    function ApiDetailFactory() {
        var apiDetail;

        return {
            get: function() {// 获取函数
                return apiDetail;
            },
            set: function(data) {// 设置函数
                apiDetail=data;
            }
        };
    }
})();
