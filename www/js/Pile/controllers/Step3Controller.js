/**
 * @ngdoc controller
 * @name Step3Controller
 * @description report pile step 3 controller
 * @requires $scope
 * @requires $rootScope
 * @requires navbarSetup
 * @requires $state
 */
angular.module('PileModule').controller('Step3Controller', ['$scope', '$rootScope', 'navbarSetup', '$state',
    function ($scope, $rootScope, navbarSetup, $state) {

        $scope.$on('$ionicView.beforeEnter', function () {

            if ($scope.pile && $scope.pile.location) {
                $scope.$parent.$parent.pile.progressStep = 3;
            }
            else {
                $state.go('app.map');
            }
        });

        $scope.$on('$ionicView.afterEnter', function () {
            $scope.scrollTopReportDiv();
        });

        /**
         * @ngdoc
         * @name Step3Controller#goToStep4
         * @methodOf Step3Controller
         * @example
         * <pre><button ng-click="goToStep4()">...</button></pre>
         * @description
         * redirects to report pile step 4
         */
        $scope.goToStep4 = function () {
            $state.go('app.pile.step4');
        };

        /**
         * @ngdoc
         * @name Step3Controller#goBack
         * @methodOf Step3Controller
         * @example
         * <pre><button ng-click="goBack()">...</button></pre>
         * @description
         * redirects to report pile step 2 view
         */
        $scope.goBack = function () {
            $state.go('app.pile.step2');
        };

        $scope.onSwipeRight = function () {
            $scope.goBack();
        };
        $scope.onSwipeLeft = function () {
            $scope.goToStep4();
        };

    }]);
