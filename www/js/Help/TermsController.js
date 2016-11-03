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
