angular.module('ServicesModule')
    /**
     * @ngdoc service
     * @service
     * @name TermsDialog
     * @description terms dialog service
     * @requires appConfig
     * @requires $mdDialog
     * @requires $translate
     */
    .service('TermsDialog', ['appConfig', '$mdDialog', '$translate',
        function (appConfig, $mdDialog, $translate) {

            return {
                show: function (ev) {
                    $mdDialog.show({
                        controller: TermsDialogController,
                        templateUrl: 'js/services/dialogs/templates/TermsDialogContent.html',
                        targetEvent: ev
                    });
                }
            };

            /**
             * @ngdoc controller
             * @name TermsDialogController
             * @description terms dialog controller
             * @requires $scope
             * @requires $mdDialog
             * @requires $http
             * @requires appConfig
             */
            function TermsDialogController($scope, $mdDialog, $http, appConfig) {

                $scope.init = function () {
                    var url = ($translate.use() === 'ro') ? '/assets/pages/terms_ro.html' : '/assets/pages/terms.html';
                    $http.get(appConfig.termsUrl + url).success(function (data) {
                        $scope.terms = data;
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
