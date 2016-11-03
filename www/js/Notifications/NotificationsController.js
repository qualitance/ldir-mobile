angular.module('NotificationsModule').controller('NotificationsController', ['$scope', '$rootScope', 'navbarSetup',
    '$state', 'appConfig', 'Activity', '$mdToast', '$cordovaSpinnerDialog', '$ionicViewSwitcher', '$translate',
    function ($scope, $rootScope, navbarSetup,
              $state, appConfig, Activity, $mdToast, $cordovaSpinnerDialog, $ionicViewSwitcher, $translate) {

        $scope.$on('$ionicView.beforeEnter', function () {
            $scope.init();
        });

        var loadingInProgress = false;

        $scope.init = function () {

            $scope.notifications = [];
            $scope.loadedAll = false;
            $scope.page = 1;
            $scope.limit = 20;
            $scope.hasInit = true;

            loadingInProgress = false;

            $scope.getNotifications();
        };

        $scope.getNotifications = function (reload) {

            if (!$scope.notifications) {
                return;
            }
            if (loadingInProgress) {
                return;
            }
            loadingInProgress = true;

            if (appConfig.isMobile) {
                $cordovaSpinnerDialog.show($translate.instant('view.notifications.loading'));
            }

            $scope.page = reload ? 1 : $scope.page;
            var loadedPage = $scope.page;

            if (reload) {
                $scope.loadedAll = false;
                $scope.notifications = [];
            }
            Activity.query({limit: $scope.limit, page: $scope.page}).$promise.then(function (resp) {
                    if (appConfig.isMobile) {
                        $cordovaSpinnerDialog.hide();
                    }

                    if (resp) {

                        if (loadedPage !== $scope.page) {
                            return;
                        }
                        $scope.notifications = $scope.notifications.concat(resp);
                        $scope.page++;

                        if (resp.length < $scope.limit) {
                            $scope.loadedAll = true;
                        }

                        $scope.$broadcast('scroll.infiniteScrollComplete');

                    } else {
                        $mdToast.show($mdToast.simple().content($translate.instant('errors.standard')));
                    }

                    loadingInProgress = false;

                    if (reload) {
                        $scope.$broadcast('scroll.refreshComplete');
                    }
                },
                function error() {
                    if (appConfig.isMobile) {
                        $cordovaSpinnerDialog.hide();
                    }
                    $mdToast.show($mdToast.simple().content($translate.instant('errors.standard')));

                    loadingInProgress = false;

                    if (reload) {
                        $scope.$broadcast('scroll.refreshComplete');
                    }
                });
        };

        $scope.getActionPrefix = function (activity) {

            switch (activity.verb) {
                case 'comment' :
                    return 'New comment was added';
                default:
                    return 'The state';
            }
        };

        $scope.goToDetail = function (pileId) {
            $state.go('app.pileDetail.details', {id: pileId});
        };

        $scope.goBack = function () {
            $ionicViewSwitcher.nextDirection('back');
            $state.go('app.map');
        };

    }]);
