(function() {
    "use strict";

    angular.module('eolinker.directive')
    /* markdown指令 */
    .directive("markdown", ['$timeout',function($timeout){
        return {
            restrict: 'AE',
            require: '?ngModel',
            scope: {
                resultHtml:'='// html转换结果
            },
            link: function($scope, element, attrs, ngModel) {
                var textarea = !!attrs.editId ? attrs.editId : 'editormd-js';
                var editor = null;
                var timer = null;

                $scope.$on('$changeApiNoteType', function(e, attr) {// 编辑器类型事件处理
                    if (editor == null) {
                        editor = editormd(textarea, {
                            height: 445,
                            saveHTMLToTextarea: true,
                            autoFocus: false,
                            toolbarIcons: function() {// 工具栏集合
                                // Or return editormd.toolbarModes[name]; // full, simple, mini
                                // Using "||" set icons align right.
                                return ["undo", "redo", "|",
                                    "bold", "del", "italic", "quote", "|",
                                    "h1", "h2", "h3", "h4", "h5", "h6", "|",
                                    "list-ul", "list-ol", "|",
                                    "link", "code", "table", "|",
                                    "watch"
                                ]
                            },
                            path: "vendor/editor.md/lib/", // Autoload modules mode, codemirror, marked... dependents libs path
                            onload: function() {// 加载完成事件处理
                                try {
                                    if (!!ngModel.$viewValue) {
                                        editor.setMarkdown(ngModel.$viewValue);
                                    }
                                } catch (e) {

                                }
                            },
                            onchange: function() {// 变化监听处理
                                timer = $timeout(function() {
                                    //console.log(editor.getMarkdown())editor.getHTML()
                                    $scope.resultHtml = editor.getHTML();
                                    ngModel.$setViewValue(editor.getMarkdown());
                                }, 0, true)
                            }
                        });
                    }
                })
                $scope.$on('$destroy', function() {// 页面跳转触发事件
                    if(timer){
                        $timeout.cancel(timer);
                    }
                });
            }
        }
    }]);

})();
