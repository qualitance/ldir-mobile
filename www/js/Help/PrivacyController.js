/**
 * @ngdoc controller
 * @name PrivacyController
 * @description privacy page controller
 * @property {Object} privacy - html containing privacy rules
 * @requires $scope
 * @requires $state
 * @requires $rootScope
 * @requires navbarSetup
 * @requires $ionicHistory
 * @requires $http
 * @requires appConfig
 * @requires $ionicViewSwitcher
 * @requires $translate
 */
angular.module('HelpModule').controller('PrivacyController', ['$scope', '$state', '$rootScope', 'navbarSetup',
    '$ionicHistory', '$http', 'appConfig', '$ionicViewSwitcher', '$translate',
    function ($scope, $state, $rootScope, navbarSetup,
              $ionicHistory, $http, appConfig, $ionicViewSwitcher, $translate) {

        $scope.$on('$ionicView.beforeEnter', function () {
            $scope.init();
        });

        $scope.init = function () {
            var url = ($translate.use() === 'ro') ? '/assets/pages/privacy_ro.html' : '/assets/pages/privacy.html';
            $http.get(appConfig.termsUrl + url).success(function (data) {
                $scope.privacy = data;
            });
        };

        /**
         * @ngdoc
         * @name PrivacyController#goBack
         * @methodOf PrivacyController
         * @example
         * <pre><button ng-click="goBack()">...</button></pre>
         * @description
         * redirects to previous state or map
         */
        $scope.goBack = function () {
            $ionicViewSwitcher.nextDirection('back');
            if ($rootScope.previousState && $rootScope.previousState.name) {
                $state.go($rootScope.previousState.name);
            }
            else {
                $state.go('app.map');
            }
        };
    }]);
