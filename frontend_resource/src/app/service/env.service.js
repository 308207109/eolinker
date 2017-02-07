(function() {
    'use strict';

    angular.module('eolinker')
    /* 环境变量信息服务定义 */
    .factory('EnvService', EnvFactory);

    EnvFactory.$inject = []

    function EnvFactory() {
        var env = null;

        return {
            get: function() {// 获取函数
                return env;
            },
            set: function(data) {// 设置函数
                env = data;
            }
        };
    }
})();
