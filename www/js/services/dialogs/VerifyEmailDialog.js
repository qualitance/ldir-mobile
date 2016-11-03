angular.module('ServicesModule')
    .service('VerifyEmailDialog', ['appConfig', '$mdDialog', 'AuthService', '$cordovaSpinnerDialog', '$cordovaDialogs',
        '$translate', '$mdToast',
        function (appConfig, $mdDialog, AuthService, $cordovaSpinnerDialog, $cordovaDialogs, $translate, $mdToast) {

            return {
                show: function (ev, email, additionalData) {
                    $mdDialog.show({
                        controller: VerifyEmailDialogController,
                        templateUrl: 'js/services/dialogs/templates/VerifyEmailDialogContent.html',
                        targetEvent: ev,
                        resolve: {
                            email: function () {
                                return email;
                            },
                            additionalData: function () {
                                return additionalData;
                            }
                        }
                    });
                }
            };

            function VerifyEmailDialogController($scope, email, additionalData) {

                $scope.email = email || {};

                $scope.additionalData = additionalData;

                $scope.hide = function () {
                    $mdDialog.hide();
                };

                $scope.cancel = function () {
                    $mdDialog.cancel();
                };

                $scope.resendEmail = function () {
                    if (appConfig.isMobile) {
                        $cordovaSpinnerDialog.show($translate.instant('dialogs.verifyEmail.success'));
                    }

                    AuthService.resendActivation($scope.email)
                        .then(function () {

                            if (appConfig.isMobile) {
                                $cordovaSpinnerDialog.hide();
                            }

                            $mdDialog.hide();

                            $mdToast.show($mdToast.simple().content($translate.instant('dialogs.verifyEmail.success')));

                        }, function (error) {

                            if (appConfig.isMobile) {
                                $cordovaSpinnerDialog.hide();
                            }

                            $mdToast.show($mdToast.simple().content($translate.instant('dialogs.verifyEmail.error')));
                        });
                };
            }
        }]);
