angular.module('ServicesModule')
    /**
     * @ngdoc service
     * @service
     * @name LocationDialog
     * @description Location enable dialog service
     * @requires appConfig
     * @requires $mdDialog
     */
    .service('LocationDialog', ['appConfig', '$mdDialog',
        function (appConfig, $mdDialog) {

            return {
                show: function (ev) {
                    return $mdDialog.show({
                        controller: LocationDialogController,
                        templateUrl: 'js/services/dialogs/templates/LocationPopupDialogContent.html',
                        targetEvent: ev
                    });
                }
            };

            /**
             * @ngdoc controller
             * @name LocationDialogController
             * @description enable location dialog controller
             * @requires $scope
             * @requires $mdDialog
             */
            function LocationDialogController($scope, $mdDialog) {

                /**
                 * @ngdoc
                 * @name LocationDialogController#switchToLocationSettings
                 * @methodOf LocationDialogController
                 * @description
                 * redirects to device location settings
                 */
                $scope.switchToLocationSettings = function () {
                    cordova.require('com.neton.cordova.diagnostic.diagnostic').switchToLocationSettings(function () {
                    });
                    $mdDialog.hide();
                };
                $scope.cancel = function () {
                    $mdDialog.cancel();
                };
            }
        }]);
