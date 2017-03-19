(function() {
    'use strict';

    angular.module('eolinker')
    /* 网页名称服务定义 */
    .factory('TitleService', TitleFactory);

    TitleFactory.$inject = ['Api','CODE']

    function TitleFactory(Api,CODE) {
        var code = CODE.SUCCESS;
        var pageTitle = 'eolinker开源版';

        return {
            get: function() {// 获取函数
                if (!!window.localStorage['TITLE']) {
                    pageTitle = window.localStorage['TITLE'];
                    return pageTitle;
                } else {// 无则请求后台
                    Api.WebName.Get().$promise.then(function(data) { 
                        if (data.statusCode == code) {
                            pageTitle = data.websiteName;
                        } else {
                            pageTitle = 'eolinker开源版';
                        }
                        window.localStorage.setItem('TITLE', data.websiteName);
                        console.log(pageTitle)
                        return pageTitle;
                    }); 
                } 
            }
        };
    }
})();
