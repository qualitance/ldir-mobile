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
