/**
 * @ngdoc controller
 * @name Step2Controller
 * @description report pile step 2 controller
 * @requires $scope
 * @requires $rootScope
 * @requires navbarSetup
 * @requires $state
 * @requires $mdToast
 * @requires $translate
 */
angular.module('PileModule').controller('Step2Controller', ['$scope', '$rootScope', 'navbarSetup', '$state', '$mdToast',
    '$translate',
    function ($scope, $rootScope, navbarSetup, $state, $mdToast, $translate) {

        $scope.$on('$ionicView.beforeEnter', function () {

            if ($scope.pile && $scope.pile.location) {
                $scope.$parent.$parent.pile.progressStep = 2;
            }
            else {
                $state.go('app.map');
            }
        });

        $scope.$on('$ionicView.afterEnter', function () {
            $scope.scrollTopReportDiv();
        });

        $scope.$watch('pile.contents', function () {

            if ($scope.pile.contents) {
                var content = [];

                for (var property in $scope.pile.contents) {
                    if ($scope.pile.contents.hasOwnProperty(property) && $scope.pile.contents[property]) {
                        content.push(property);
                    }
                }

                if (!$scope.pile.contents || !content.length) {
                    $scope.pile.hasReachedLastStep = false;
                } else if (!$scope.pile.new) {
                    $scope.pile.hasReachedLastStep = true;
                }
            }
        }, true);

        /**
         * @ngdoc
         * @name Step2Controller#goToStep3
         * @methodOf Step2Controller
         * @example
         * <pre><button ng-click="goToStep3()">...</button></pre>
         * @description
         * redirects to report pile step 3 if the pile has at 1 content type selected
         */
        $scope.goToStep3 = function () {

            var content = [];

            for (var property in $scope.pile.contents) {
                if ($scope.pile.contents.hasOwnProperty(property) && $scope.pile.contents[property]) {
                    content.push(property);
                }
            }

            if (!$scope.pile.contents || !content.length) {
                $mdToast.show($mdToast.simple().content($translate.instant('views.pile.step2.content')));
                return;
            }

            $state.go('app.pile.step3');
        };

        /**
         * @ngdoc
         * @name Step2Controller#goBack
         * @methodOf Step2Controller
         * @example
         * <pre><button ng-click="goBack()">...</button></pre>
         * @description
         * redirects to report pile step 1 view
         */
        $scope.goBack = function () {
            $state.go('app.pile.step1');
        };

        $scope.onSwipeRight = function () {
            $scope.goBack();
        };
        $scope.onSwipeLeft = function () {
            $scope.goToStep3();
        };

    }]);
