/**
 * @ngdoc controller
 * @name PileController
 * @description pile view main controller
 * @property {Object} pile - pile object
 * @property {Integer} maxPhotoCount - maximum number of photos to show
 * @requires $scope
 * @requires $rootScope
 * @requires $mdSidenav
 * @requires $state
 * @requires $mdToast
 * @requires appConfig
 */
angular.module('PileModule').controller('PileController', ['$scope', '$rootScope', '$mdSidenav', '$state', '$mdToast',
    'appConfig',
    function ($scope, $rootScope, $mdSidenav, $state, $mdToast, appConfig) {

        $scope.$on('$ionicView.beforeEnter', function () {

            if ($state.is('app.pile')) {
                $scope.init();
            }
        });

        $scope.init = function () {

            if (!$state.params.location) {
                $state.go('app.map');
                return;
            }

            $scope.pile = {
                size: 1,
                location: {
                    lat: $state.params.location.lat,
                    lng: $state.params.location.lng
                },
                photos: [],
                areas: [],
                progressStep: 1,
                new: true
            };

            $scope.maxPhotoCount = appConfig.maxPhotoCount;
        };

        /**
         * @ngdoc
         * @name PileController#scrollTopReportDiv
         * @methodOf PileController
         * @description
         * scrolls the view to div top
         */
        $scope.scrollTopReportDiv = function () {
            var reportDivs = document.getElementsByClassName('pile-report-step-container');
            var reportDivsArray = Array.prototype.slice.call(reportDivs);
            reportDivsArray.forEach(function (element) {
                element.scrollTop = 0;
            });
        };

        $scope.$on('$stateChangeStart', function (event, toState) {
            if (toState.name.indexOf('app.pile') === -1) {
                $scope.pile = undefined;
            }
        });

    }]);
