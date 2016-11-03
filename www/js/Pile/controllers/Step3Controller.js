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

        $scope.goToStep4 = function () {
            $state.go('app.pile.step4');
        };

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
