'use strict';

var gutil = require('gulp-util');

exports.paths = {
  src:  'src',
  dist: 'eolinker',
  tmp:  '.tmp',
  e2e:  'test_e2e',
  env:{

  }
};

exports.modules={
  ConstantModuleName:'eolinker',
  templateModuleName:'eolinker'
}

/**
 * [依赖配置]
 */
exports.vendor = {
  // 程序启动依赖模块
  base: {
    source: require('../vendor.base.json'),
    dest: 'src/app',
    name: 'vendor'
  },
  
  // 按需加载模块
  app: {
    source: require('../vendor.json'),
    dest: 'src/vendor'
  }
};

/**
 *  错误处理
 */
exports.errorHandler = function() {
  return function (err) {
    gutil.beep();
    gutil.log(err.toString());
  }
};

