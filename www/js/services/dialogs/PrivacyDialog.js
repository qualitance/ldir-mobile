angular.module('ServicesModule')
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
