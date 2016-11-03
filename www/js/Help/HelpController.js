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

        $scope.slideHasChanged = function (index) {
            if ($scope.hasHelpSlider) {
                return;
            }
            $scope.isLastStep = (index === 5);
        };

        $scope.setHelpFlag = function () {
            LocalStorageService.set('helpSlider', true);
            $ionicViewSwitcher.nextDirection('forward');
            $state.go('app.map');
        };

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
