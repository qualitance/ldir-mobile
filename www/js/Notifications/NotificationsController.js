/**
 * @ngdoc controller
 * @name NotificationsController
 * @description notifications page controller
 * @property {Array} notifications - array containing notifications objects
 * @property {Boolean} loadedAll - flag
 * @property {Integer} page - notification page to request
 * @property {Integer} limit - notifications limit per page
 * @requires $scope
 * @requires $rootScope
 * @requires navbarSetup
 * @requires appConfig
 * @requires Activity
 * @requires $mdToast
 * @requires $cordovaSpinnerDialog
 * @requires $ionicViewSwitcher
 * @requires $translate
 */
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

            loadingInProgress = false;

            $scope.getNotifications();
        };

        /**
         * @ngdoc
         * @name NotificationsController#getNotifications
         * @methodOf NotificationsController
         * @param {Boolean} reload - clear notification array and reload flag
         * @description
         * gets user's notifications
         */
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

        /**
         * @ngdoc
         * @name NotificationsController#goToDetail
         * @methodOf NotificationsController
         * @example
         * <pre><button ng-click="goToDetail()">...</button></pre>
         * @param {String} pileId - pile's id
         * @description
         * redirects to pile details view
         */
        $scope.goToDetail = function (pileId) {
            $state.go('app.pileDetail.details', {id: pileId});
        };

        /**
         * @ngdoc
         * @name NotificationsController#goBack
         * @methodOf NotificationsController
         * @example
         * <pre><button ng-click="goBack()">...</button></pre>
         * @description
         * redirects to map view
         */
        $scope.goBack = function () {
            $ionicViewSwitcher.nextDirection('back');
            $state.go('app.map');
        };

    }]);
