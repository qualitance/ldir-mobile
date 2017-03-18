angular.module('ServicesModule')
    /**
     * @ngdoc service
     * @service
     * @name ZoomImagePopupDialog
     * @description zoom image dialog service
     * @requires appConfig
     * @requires $mdDialog
     */
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

            /**
             * @ngdoc controller
             * @name ZoomImagePopupDialogController
             * @description zoom image dialog controller
             * @property {Object} image - image object
             * @requires $scope
             * @requires $mdDialog
             * @requires image
             */
            function ZoomImagePopupDialogController($scope, $mdDialog, image) {

                $scope.image = image || null;

                $scope.cancel = function () {
                    $mdDialog.cancel();
                };
            }
        }]);
