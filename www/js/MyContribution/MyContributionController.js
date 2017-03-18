/**
 * @ngdoc controller
 * @name MyContributionController
 * @description my contribution page controller
 * @property {Integer} reportedPage - user's reported piles page to request
 * @property {Integer} contributedPage - user's contributed piles page to request
 * @property {Integer} limit - piles limit to request
 * @property {Array} reportedPiles - reported piles array
 * @property {Array} contributedPiles - contributed piles array
 * @property {Boolean} loadedAllReported - finished loading reported piles flag
 * @property {Boolean} loadedAllContributed - finished contributed reported piles flag
 * @requires $scope
 * @requires $rootScope
 * @requires navbarSetup
 * @requires $state
 * @requires appConfig
 * @requires Pile
 * @requires $mdToast
 * @requires Pile
 * @requires $mdToast
 * @requires $cordovaSpinnerDialog
 * @requires $ionicViewSwitcher
 * @requires $translate
 */
angular.module('MyContributionModule').controller('MyContributionController', ['$scope', '$rootScope', 'navbarSetup',
    '$state', 'appConfig', 'Pile', '$mdToast', '$cordovaSpinnerDialog', '$ionicViewSwitcher', '$translate',
    function ($scope, $rootScope, navbarSetup,
              $state, appConfig, Pile, $mdToast, $cordovaSpinnerDialog, $ionicViewSwitcher, $translate) {

        $scope.$on('$ionicView.afterEnter', function () {
            $scope.init();
        });

        $scope.init = function () {

            $scope.reportedPage = 1;
            $scope.contributedPage = 1;
            $scope.limit = 20;

            $scope.reportedPiles = [];
            $scope.contributedPiles = [];

            $scope.loadedAllReported = false;
            $scope.loadedAllContributed = false;

            $scope.getReportedPiles();
            $scope.getContributedPiles();
        };

        /**
         * @ngdoc
         * @name MyContributionController#getReportedPiles
         * @methodOf MyContributionController
         * @param {Boolean} reload - clear piles array and reload flag
         * @description
         * gets user's reported piles
         */
        $scope.getReportedPiles = function (reload) {

            if (!$scope.reportedPiles) {
                return;
            }

            $scope.reportedPage = reload ? 1 : $scope.reportedPage;
            var loadedPage = $scope.reportedPage;

            if (reload) {
                $scope.loadedAllReported = false;
                $scope.reportedPiles = [];
            }

            if (appConfig.isMobile) {
                $cordovaSpinnerDialog.show($translate.instant('app.messages.loading'));
            }

            Pile.query({limit: $scope.limit, page: $scope.reportedPage, sort: {order: -1, by: 'created_at'}})
                .$promise.then(function (resp) {
                    if (appConfig.isMobile) {
                        $cordovaSpinnerDialog.hide();
                    }
                    if (resp) {

                        if (loadedPage !== $scope.reportedPage) {
                            return;
                        }
                        angular.forEach(resp, function (item) {
                            item.sortDate = new Date(item.created_at);
                        });

                        $scope.reportedPiles = $scope.reportedPiles.concat(resp);
                        $scope.reportedPage++;

                        if (resp.length < $scope.limit) {
                            $scope.loadedAllReported = true;
                        }

                        $scope.$broadcast('scroll.infiniteScrollComplete');

                    } else {
                        $mdToast.show($mdToast.simple().content($translate.instant('errors.standard')));
                    }

                    if (reload) {
                        $scope.$broadcast('scroll.refreshComplete');
                    }
                },
                function error() {
                    if (appConfig.isMobile) {
                        $cordovaSpinnerDialog.hide();
                    }
                    $mdToast.show($mdToast.simple().content($translate.instant('errors.standard')));

                    if (reload) {
                        $scope.$broadcast('scroll.refreshComplete');
                    }
                });
        };

        /**
         * @ngdoc
         * @name MyContributionController#getContributedPiles
         * @methodOf MyContributionController
         * @param {Boolean} reload - clear piles array and reload flag
         * @description
         * gets user's contributed piles
         */
        $scope.getContributedPiles = function (reload) {

            if (!$scope.contributedPiles) {
                return;
            }

            $scope.contributedPage = reload ? 1 : $scope.contributedPage;
            var loadedPage = $scope.contributedPage;

            if (reload) {
                $scope.loadedAllContributed = false;
                $scope.contributedPiles = [];
            }

            Pile.query({
                contributions: true,
                limit: $scope.limit,
                page: $scope.contributedPage,
                sort: {order: -1, by: 'created_at'}
            }).$promise.then(function (resp) {
                    if (resp) {

                        if (loadedPage !== $scope.contributedPage) {
                            return;
                        }

                        angular.forEach(resp, function (item) {
                            item.sortDate = new Date(item.created_at);
                        });

                        $scope.contributedPiles = $scope.contributedPiles.concat(resp);
                        $scope.contributedPage++;

                        if (resp.length < $scope.limit) {
                            $scope.loadedAllContributed = true;
                        }

                        $scope.$broadcast('scroll.infiniteScrollComplete');

                    } else {
                        $mdToast.show($mdToast.simple().content($translate.instant('errors.standard')));
                    }

                    if (reload) {
                        $scope.$broadcast('scroll.refreshComplete');
                    }
                },
                function error() {
                    $mdToast.show($mdToast.simple().content($translate.instant('errors.standard')));

                    if (reload) {
                        $scope.$broadcast('scroll.refreshComplete');
                    }
                });
        };

        /**
         * @ngdoc
         * @name MyContributionController#goToDetail
         * @methodOf MyContributionController
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
         * @name MyContributionController#goBack
         * @methodOf MyContributionController
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
