/**
 * @ngdoc controller
 * @name PileDetailsController
 * @description pile details controller
 * @property {Object} confirmFlags - pile confirm flags object
 * @requires $scope
 * @requires $rootScope
 * @requires $state
 * @requires navbarSetup
 * @requires Pile
 * @requires CommentsService
 * @requires $mdToast
 * @requires appConfig
 * @requires ZoomImagePopupDialog
 * @requires $ionicNavBarDelegate
 * @requires $timeout
 * @requires $ionicViewSwitcher
 * @requires $translate
 */
angular.module('PileModule').controller('PileDetailsController', ['$scope', '$rootScope', '$state', 'navbarSetup',
    'Pile', 'CommentsService', '$mdToast', 'appConfig', 'ZoomImagePopupDialog', '$ionicNavBarDelegate', '$timeout',
    '$ionicViewSwitcher', '$translate',
    function ($scope, $rootScope, $state, navbarSetup,
              Pile, CommentsService, $mdToast, appConfig, ZoomImagePopupDialog, $ionicNavBarDelegate, $timeout,
              $ionicViewSwitcher, $translate) {

        var prevState;

        $scope.$on('$ionicView.beforeEnter', function () {
            $scope.init();
        });
        $scope.init = function () {

            if (!$state.params.id) {
                $state.go('app.map');
                return;
            }

            if ($rootScope.previousState.name !== 'app.pileDetail.comments') {
                prevState = $rootScope.previousState.name;
            }

            $scope.confirmFlags = {};

            Pile.details({id: $state.params.id}).$promise.then(function (result) {
                    if (result) {
                        $scope.pile = result;
                        $rootScope.pileLocation = $scope.pile.location;
                        $scope.getConfirmStatus($scope.pile);
                        $timeout(function () {
                            $ionicNavBarDelegate.title('Pile #' + $scope.pile.nr_ord);
                        }, 100);

                        // GET PILE COMMENTS
                        CommentsService.query({pile: $state.params.id}).$promise.then(function success(data) {
                                if (data) {
                                    $scope.pile.comments = data;
                                } else {
                                    $mdToast.show($mdToast.simple().content($translate.instant('errors.standard')));
                                }
                            },
                            function error(msg) {
                                $mdToast.show($mdToast.simple().content($translate.instant('errors.standard')));
                            });
                    } else {
                        $mdToast.show($mdToast.simple().content($translate.instant('errors.standard')));
                    }
                },
                function error(msg) {
                    $mdToast.show($mdToast.simple().content($translate.instant('errors.standard')));
                });
        };

        /**
         * @ngdoc
         * @name PileDetailsController#getConfirmStatus
         * @methodOf PileDetailsController
         * @description
         * checks if pile can be confirmed by current user
         */
        $scope.getConfirmStatus = function (pile) {
            $scope.confirmFlags.isOwnPile = pile.user === $rootScope.me._id;
            $scope.confirmFlags.canConfirm = pile.status === 'pending' &&
                pile.confirm.indexOf($rootScope.me._id) === -1 &&
                pile.unconfirm.indexOf($rootScope.me._id) === -1;
            $scope.confirmFlags.isConfirmed = pile.confirm.indexOf($rootScope.me._id) !== -1;
            $scope.confirmFlags.isUnConfirmed = pile.unconfirm.indexOf($rootScope.me._id) !== -1;
        };

        /**
         * @ngdoc
         * @name PileDetailsController#confirm
         * @methodOf PileDetailsController
         * @example
         * <pre><md-button ng-click="confirm(0)">Confirm</md-button></pre>
         * @param {Integer} flag - confirm/unconfirm flag
         * @description
         * sets the pile confirm flag
         */
        $scope.confirm = function (flag) {
            var confirmAction = flag ? 'confirm' : 'unconfirm';
            Pile.confirm({pile: $scope.pile._id, action: confirmAction}).$promise.then(function success(resp) {
                    $scope.pile.confirm = resp.confirm;
                    $scope.pile.unconfirm = resp.unconfirm;
                    $scope.getConfirmStatus($scope.pile);
                    $scope.getStats();
                },
                function () {
                    $mdToast.show($mdToast.simple().content($translate.instant('errors.standard')));
                });
        };

        /**
         * @ngdoc
         * @name PileDetailsController#zoomImage
         * @methodOf PileDetailsController
         * @example
         * <pre> <a ng-click="zoomImage(image.src)"><img data-ng-src="{{ image.src }}"alt="image{{ $index }}"></a></pre>
         * @param {String} image - image url
         * @description
         * open zoom modal for specific pile image
         */
        $scope.zoomImage = function (image) {
            if (image) {
                ZoomImagePopupDialog.show(null, image);
            }
        };

        /**
         * @ngdoc
         * @name PileDetailsController#goBack
         * @methodOf PileDetailsController
         * @example
         * <pre><button ng-click="goBack()">...</button></pre>
         * @description
         * redirects to previous state or map
         */
        $scope.goBack = function () {

            if (prevState) {
                $state.go(prevState);
            }
            else {
                $ionicViewSwitcher.nextDirection('back');
                $state.go('app.map');
            }
        };

    }]);
