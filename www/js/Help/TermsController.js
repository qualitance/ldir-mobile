/**
 * @ngdoc controller
 * @name TermsController
 * @description terms page controller
 * @property {Object} terms - html containing terms and conditions
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
angular.module('HelpModule').controller('TermsController', ['$scope', '$state', '$rootScope', 'navbarSetup',
    '$ionicHistory', '$http', 'appConfig', '$ionicViewSwitcher', '$translate',
    function ($scope, $state, $rootScope, navbarSetup,
              $ionicHistory, $http, appConfig, $ionicViewSwitcher, $translate) {

        $scope.$on('$ionicView.beforeEnter', function () {
            $scope.init();
        });

        $scope.init = function () {
            var url = ($translate.use() === 'ro') ? '/assets/pages/terms_ro.html' : '/assets/pages/terms.html';
            $http.get(appConfig.termsUrl + url).success(function (data) {
                $scope.terms = data;
            });
        };

        /**
         * @ngdoc
         * @name TermsController#goBack
         * @methodOf TermsController
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
