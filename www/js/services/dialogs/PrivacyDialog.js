angular.module('ServicesModule')
    /**
     * @ngdoc service
     * @service
     * @name PrivacyDialog
     * @description privacy dialog service
     * @requires appConfig
     * @requires $mdDialog
     * @requires $translate
     */
    .service('PrivacyDialog', ['appConfig', '$mdDialog', '$translate',
        function (appConfig, $mdDialog, $translate) {

            return {
                show: function (ev) {
                    $mdDialog.show({
                        controller: PrivacyDialogController,
                        templateUrl: 'js/services/dialogs/templates/PrivacyDialogContent.html',
                        targetEvent: ev
                    });
                }
            };

            /**
             * @ngdoc controller
             * @name PrivacyDialogController
             * @description privacy dialog controller
             * @requires $scope
             * @requires $mdDialog
             * @requires $http
             * @requires appConfig
             */
            function PrivacyDialogController($scope, $mdDialog, $http, appConfig) {

                $scope.init = function () {
                    var url = ($translate.use() === 'ro') ? '/assets/pages/privacy_ro.html' : '/assets/pages/privacy.html';
                    $http.get(appConfig.termsUrl + url).success(function (data) {
                        $scope.privacy = data;
                    });
                };

                $scope.hide = function () {
                    $mdDialog.hide();
                };
                $scope.cancel = function () {
                    $mdDialog.cancel();
                };

                $scope.init();
            }
        }]);
