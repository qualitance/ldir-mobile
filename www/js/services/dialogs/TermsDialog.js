angular.module('ServicesModule')
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
