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
