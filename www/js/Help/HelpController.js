/**
 * @ngdoc controller
 * @name HelpController
 * @description help page controller
 * @property {Object} language - current language
 * @requires $scope
 * @requires $state
 * @requires $rootScope
 * @requires navbarSetup
 * @requires $ionicHistory
 * @requires LocalStorageService
 * @requires $ionicViewSwitcher
 * @requires $translate
 */
angular.module('HelpModule').controller('HelpController', ['$scope', '$state', '$rootScope', 'navbarSetup',
    '$ionicHistory', 'LocalStorageService', '$ionicViewSwitcher', '$translate',
    function ($scope, $state, $rootScope, navbarSetup, $ionicHistory,
              LocalStorageService, $ionicViewSwitcher, $translate) {

        $scope.$on('$ionicView.beforeEnter', function () {
            $scope.hasHelpSlider = LocalStorageService.get('helpSlider');
            $scope.init();
        });

        $scope.init = function () {
            $scope.language = $translate.use();
        };

        /**
         * @ngdoc
         * @name HelpController#slideHasChanged
         * @methodOf HelpController
         * @example
         * <pre><ion-slide-box show-pager="1" class="height100" on-slide-changed="slideHasChanged($index)">...</pre>
         * @param {Integer} index - current slide index
         * @description
         * checks if slide reaches last step
         */
        $scope.slideHasChanged = function (index) {
            if ($scope.hasHelpSlider) {
                return;
            }
            $scope.isLastStep = (index === 5);
        };

        /**
         * @ngdoc
         * @name HelpController#setHelpFlag
         * @methodOf HelpController
         * @example
         * <pre><button ng-if="!hasHelpSlider" ng-click="setHelpFlag()"></button></pre>
         * @description
         * sets help flag in local storage, redirects to map
         */
        $scope.setHelpFlag = function () {
            LocalStorageService.set('helpSlider', true);
            $ionicViewSwitcher.nextDirection('forward');
            $state.go('app.map');
        };

        /**
         * @ngdoc
         * @name HelpController#goBack
         * @methodOf HelpController
         * @example
         * <pre><button ng-if="hasHelpSlider" ng-click="goBack()"></button></pre>
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
    }
]);
