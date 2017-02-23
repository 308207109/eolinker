(function() {
    'use strict';

    angular
        .module('eolinker')
        /* 按需加载模块名和路径 */
        .constant('APP_REQUIRES', {
            // jQuery based and standalone scripts
            scripts: {},
            // Angular based script (use the right module name)
            modules: [
                // options {serie: true,insertBefore: '#load_styles_before'}
                {
                    name: 'particles',
                    files: ['vendor/particles.js/particles.min.js']
                }, {
                    name: 'clipboard',
                    files: ['vendor/clipboard/dist/clipboard.min.js']
                }, {
                    name: 'wangEditor',
                    files: [
                        'vendor/wangEditor/dist/css/wangEditor.css',
                        'vendor/wangEditor/dist/js/wangEditor.min.js',
                        "vendor/wangEditor/dist/js/lib/plupload.full.min.js",
                        "vendor/wangEditor/dist/js/lib/qiniu.min.js"
                    ]
                }, {
                    name: 'markdown',
                    files: [
                        "vendor/editor.md/fonts/fontawesome-webfont.*",
                        "vendor/editor.md/css/editormd.min.css",
                        "vendor/editor.md/editormd.min.js",
                        "vendor/editor.md/plugins/link-dialog/link-dialog.js ",
                        "vendor/editor.md/plugins/table-dialog/table-dialog.js ",
                        "vendor/editor.md/lib/**"
                    ]
                }
            ]
        });

})();
