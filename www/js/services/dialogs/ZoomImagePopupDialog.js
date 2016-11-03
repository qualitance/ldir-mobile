angular.module('ServicesModule')
    .service('ZoomImagePopupDialog', ['appConfig', '$mdDialog',
        function (appConfig, $mdDialog) {

            return {
                show: function (ev, image) {
                    $mdDialog.show({
                        controller: ZoomImagePopupDialogController,
                        templateUrl: 'js/services/dialogs/templates/ZoomImagePopupDialogContent.html',
                        targetEvent: ev,
                        resolve: {
                            image: function () {
                                return image;
                            }
                        }
                    });
                }
            };

            function ZoomImagePopupDialogController($scope, $mdDialog, image) {

                $scope.image = image || null;

                $scope.cancel = function () {
                    $mdDialog.cancel();
                };
            }
        }]);
