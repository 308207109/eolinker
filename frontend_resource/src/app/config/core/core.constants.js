/**=========================================================
 * Module: constants.js
 * Define constants to inject across the application
 =========================================================*/

(function() {
  'use strict';

  angular
    .module('eolinker')
    .constant('AUTH_EVENTS', {
      //--登录成功--
      loginSuccess: 'auth-login-success',
      //--登录失败--
      loginFailed: 'auth-login-failed',
      //--退出成功--
      logoutSuccess: 'auth-logout-success',
      //--认证超时--
      sessionTimeout: 'auth-session-timeout',
      //--未认证权限--
      notAuthenticated: 'auth-not-authenticated',
      //--未登录--
      notAuthorized: 'auth-not-authorized',
      //--服务器出错--
      systemError: 'something-wrong-system'
    })
    .constant('USER_ROLES', {
      USER: 'guest'
    })
})();