(function () { 
 return angular.module("eolinker")
.constant("serverUrl", "/eolinker/server/index.php")
.constant("isDebug", true)
.constant("assetUrl", "app/")
.constant("cookieConfig", {"domain":"localhost"});

})();
