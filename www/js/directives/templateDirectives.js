/**
 * @ngdoc directive
 * @name ldrUserPhoto
 * @description user photo directive
 * @example
 * <pre><ldr-user-photo class="logo80" user="me"></ldr-user-photo></pre>
 */
angular.module('TemplateDirectivesModule', [])
.directive('ldrUserPhoto', ['$window',
    function () {
        return {
            restrict: 'AE',
            templateUrl: 'js/directives/templates/user-photo.html',
            scope: {
                user: '=user'
            }
        };
    }
]);
