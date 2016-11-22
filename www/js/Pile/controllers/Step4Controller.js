/**
 * @ngdoc controller
 * @name Step4Controller
 * @description report pile step 4 controller
 * @requires $scope
 * @requires $state
 * @requires Pile
 * @requires appConfig
 * @requires $rootScope
 * @requires OfflineService
 * @requires $mdToast
 * @requires $cordovaSpinnerDialog
 * @requires $cordovaCamera
 * @requires $cordovaFile
 * @requires $ionicViewSwitcher
 * @requires $translate
 * @requires CreatePileService
 */
angular.module('PileModule').controller('Step4Controller', ['$scope', '$state', 'Pile', 'appConfig', '$rootScope',
    'OfflineService', '$mdToast', '$cordovaSpinnerDialog', '$cordovaCamera', '$cordovaFile', '$ionicViewSwitcher',
    '$translate', 'CreatePileService',
    function ($scope, $state, Pile, appConfig, $rootScope,
              OfflineService, $mdToast, $cordovaSpinnerDialog, $cordovaCamera, $cordovaFile, $ionicViewSwitcher,
              $translate, CreatePileService) {

        $scope.$on('$ionicView.beforeEnter', function () {
            if ($scope.pile && $scope.pile.location) {
                $scope.pile.hasReachedLastStep = true;
                $scope.$parent.$parent.pile.progressStep = 4;
                $scope.pile.new = false;

                $scope.pile.content = [];

                for (var property in $scope.pile.contents) {
                    if ($scope.pile.contents.hasOwnProperty(property) && $scope.pile.contents[property]) {
                        $scope.pile.content.push(property);
                    }
                }
            }
            else {
                $ionicViewSwitcher.nextDirection('forward');
                $state.go('app.map');
            }
        });

        $scope.$on('$ionicView.afterEnter', function () {
            $scope.scrollTopReportDiv();
        });

        /**
         * @ngdoc
         * @name Step4Controller#savePile
         * @methodOf Step4Controller
         * @example
         * <pre><md-button ng-click="savePile()">Save Pile</md-button></pre>
         * @description
         * saves the pile created in previous steps or adds pile object to queue if offline
         */
        $scope.savePile = function () {

            if ($scope.isSaving) {
                return;
            }
            $scope.isSaving = true;

            if ($rootScope.online) {
                if (appConfig.isMobile) {
                    $cordovaSpinnerDialog.show($translate.instant('views.pile.step4.loading'));
                    CreatePileService.createPile($scope.pile).then(function () {
                        $cordovaSpinnerDialog.hide();
                        $mdToast.show($mdToast.simple().content($translate.instant('views.pile.step4.pileSuccess')));
                        cameraCleanUpAndGo();
                    }, function () {
                        $cordovaSpinnerDialog.hide();
                        $mdToast.show($mdToast.simple().content($translate.instant('errors.standard')));
                        cameraCleanUpAndGo();
                    });
                }
            }
            else {
                OfflineService.addToQueue($scope.pile);
                cameraCleanUpAndGo();
                $mdToast.show($mdToast.simple().content($translate.instant('views.pile.step4.pileOffline')));
            }
        };

        /**
         * @ngdoc
         * @name Step4Controller#goBack
         * @methodOf Step4Controller
         * @example
         * <pre><button ng-click="goBack()">...</button></pre>
         * @description
         * redirects to report pile step 3 view
         */
        $scope.goBack = function () {
            $state.go('app.pile.step3');
        };

        $scope.onSwipeRight = function () {
            $scope.goBack();
        };

        /**
         * @ngdoc
         * @name Step4Controller#cameraCleanUpAndGo
         * @methodOf Step4Controller
         * @description
         * redirects to map pile after cleaning up the camera cache
         */
        function cameraCleanUpAndGo() {
            $scope.isSaving = false;
            $ionicViewSwitcher.nextDirection('forward');
            $state.go('app.map');
            $cordovaCamera.cleanup().then(function () {
            }, function (error) {
            });
        }
    }]);
