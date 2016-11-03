angular.module('ServicesModule')
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

            function LocationDialogController($scope, $mdDialog) {

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
