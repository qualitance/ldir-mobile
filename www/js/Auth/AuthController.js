/**
 * @ngdoc controller
 * @name AuthController
 * @description authentication page controller
 * @property {Object} user - current user
 * @property {Object} newUser - user to register
 * @property {Object} resetData - recovery data
 * @property {Boolean} loggingInWithFB - flag for login/facebook login
 * @requires $scope
 * @requires appConfig
 * @requires LocalStorageService
 * @requires TermsDialog
 * @requires VerifyEmailDialog
 * @requires $rootScope
 * @requires $state
 * @requires $cordovaDialogs
 * @requires $cordovaSpinnerDialog
 * @requires $cordovaFacebook
 * @requires PushNotificationService
 * @requires User
 * @requires $mdDialog
 * @requires $ionicScrollDelegate
 * @requires PrivacyDialog
 * @requires $translate
 */
angular.module('AuthModule').controller('AuthController', ['$scope', 'AuthService', 'appConfig', 'LocalStorageService',
    'TermsDialog', 'VerifyEmailDialog', '$rootScope', '$state', '$cordovaDialogs', '$cordovaSpinnerDialog',
    '$cordovaFacebook', 'PushNotificationService', 'User', '$mdDialog', '$ionicScrollDelegate', 'PrivacyDialog',
    '$translate',
    function ($scope, AuthService, appConfig, LocalStorageService,
              TermsDialog, VerifyEmailDialog, $rootScope, $state, $cordovaDialogs, $cordovaSpinnerDialog,
              $cordovaFacebook, PushNotificationService, User, $mdDialog, $ionicScrollDelegate, PrivacyDialog,
              $translate) {

        $scope.$on('$ionicView.beforeEnter', function () {
            $scope.init();
        });

        $scope.init = function () {
            $scope.user = {};
            $scope.newUser = {};
            $scope.resetData = {};
            $scope.loggingInWithFB = false;
        };

        /**
         * @ngdoc
         * @name AuthController#login
         * @methodOf AuthController
         * @example
         * <pre><md-button ng-click="login(loginForm)">Login</md-button></pre>
         * @param {object} form - login form
         * @description
         * login with normal user
         */
        $scope.login = function (form) {

            form.$setSubmitted();
            if (form.$valid) {
                var deviceType = (appConfig.isMobile && appConfig.isIos) ? 'ios' : 'android';

                if (appConfig.isMobile) {
                    var spinnerMessage = $translate.instant('views.auth.spinnerMessage1');
                    $cordovaSpinnerDialog.show(spinnerMessage);
                }

                AuthService.login($scope.user.email, $scope.user.password, deviceType, $rootScope.notificationToken)
                    .then(function (response) {

                        $rootScope.token = response.token;
                        LocalStorageService.set('token', response.token);

                        if ($rootScope.notificationToken) {
                            PushNotificationService.subscribeDevice(deviceType, $rootScope.notificationToken);
                        }

                        User.get().$promise.then(
                            function (user) {

                                if (appConfig.isMobile) {
                                    $cordovaSpinnerDialog.hide();
                                }

                                AuthService.setCurrentUser(user);

                                // RESET FORM
                                form.$setPristine();
                                form.$setUntouched();
                                form.$submitted = false;

                                // CHECK IF USER HAS SEEN THE SLIDER HELP
                                var hasHelpSlider = LocalStorageService.get('helpSlider');
                                if (!hasHelpSlider) {
                                    $state.go('app.help');
                                }
                                else {
                                    $state.go('app.map');
                                }
                            },
                            function () {
                                if (appConfig.isMobile) {
                                    $cordovaSpinnerDialog.hide();
                                }
                                var loginFailedMessage = $translate.instant('view.auth.modal.loginFailed');
                                $mdDialog.show(
                                    $mdDialog.alert()
                                        .parent(angular.element(document.body))
                                        .title(loginFailedMessage)
                                        .content(loginFailedMessage)
                                        .ariaLabel(loginFailedMessage)
                                        .ok('Ok')
                                );
                            });
                    }, function (error) {
                        if (appConfig.isMobile) {
                            $cordovaSpinnerDialog.hide();
                        }

                        if (error.requireVerification) {
                            VerifyEmailDialog.show(null, $scope.user.email, error.data);
                        }
                        else {
                            var loginFailedMessage = $translate.instant('view.auth.modal.loginFailed');
                            $mdDialog.show(
                                $mdDialog.alert()
                                    .parent(angular.element(document.body))
                                    .title()
                                    .content(error.message)
                                    .ariaLabel(loginFailedMessage)
                                    .ok('Ok')
                            );
                        }
                    });
            }
        };

        /**
         * @ngdoc
         * @name AuthController#register
         * @methodOf AuthController
         * @example
         * <pre><md-button ng-click="register(registerForm)">Register</md-button></pre>
         * @param {object} form - register form
         * @description
         * register with new user
         */
        $scope.register = function (form) {
            form.$setSubmitted();
            if (form.$valid) {

                if (appConfig.isMobile) {
                    var spinnerMessage = $translate.instant('views.auth.spinnerMessage2');
                    $cordovaSpinnerDialog.show(spinnerMessage);
                }

                AuthService.register($scope.newUser['first_name'], $scope.newUser['last_name'],
                    $scope.newUser.email, $scope.newUser.pass)
                    .then(function () {

                        if (appConfig.isMobile) {
                            $cordovaSpinnerDialog.hide();
                        }

                        $scope.newUser = {};
                        form.$setPristine();
                        form.$setUntouched();
                        form.$submitted = false;

                        var registerSuccessTitle = $translate.instant('views.auth.modal.registerSuccess.title');
                        var registerSuccessContent = $translate.instant('views.auth.registerTab.emailSent');

                        $mdDialog.show(
                            $mdDialog.alert()
                                .parent(angular.element(document.body))
                                .title(registerSuccessTitle)
                                .content(registerSuccessContent)
                                .ariaLabel(registerSuccessTitle)
                                .ok('Ok')
                        );

                    }, function (error) {

                        if (appConfig.isMobile) {
                            $cordovaSpinnerDialog.hide();
                        }

                        var registerFailed = $translate.instant('view.auth.modal.registerFailed');
                        $mdDialog.show(
                            $mdDialog.alert()
                                .parent(angular.element(document.body))
                                .title(registerFailed)
                                .content(error.message)
                                .ariaLabel(registerFailed)
                                .ok('Ok')
                        );
                    });
            }
        };

        /**
         * @ngdoc
         * @name AuthController#facebookLogin
         * @methodOf AuthController
         * @example
         * <pre><md-button ng-click="facebookLogin()">Login</md-button></pre>
         * @description
         * login with facebook account
         */
        $scope.facebookLogin = function () {

            var deviceType = (appConfig.isMobile && appConfig.isIos) ? 'ios' : 'android';

            $cordovaFacebook.login(['public_profile', 'email'])
                .then(function (fbResponse) {

                    LocalStorageService.setObject('fbUser', fbResponse);
                    $scope.loggingInWithFB = true;

                    AuthService.fbLogin(fbResponse.authResponse.userID, fbResponse.authResponse.accessToken,
                        deviceType, $rootScope.notificationToken).then(function (response) {

                        $rootScope.token = response.token;
                        LocalStorageService.set('token', response.token);

                        if ($rootScope.notificationToken) {
                            PushNotificationService.subscribeDevice(deviceType, $rootScope.notificationToken);
                        }

                        User.get().$promise.then(
                            function (user) {
                                // HIDE PROGRESS CIRCULAR
                                $scope.loggingInWithFB = false;

                                AuthService.setCurrentUser(user);

                                // CHECK IF USER HAS SEEN THE SLIDER HELP
                                var hasHelpSlider = LocalStorageService.get('helpSlider');
                                if (!hasHelpSlider) {
                                    $state.go('app.help');
                                }
                                else {
                                    $state.go('app.map');
                                }
                            },
                            function (error) {
                                // HIDE PROGRESS CIRCULAR
                                $scope.loggingInWithFB = false;

                                var failedFBloginMessage = $translate.instant('view.auth.modal.loginFBFailed.title');
                                $mdDialog.show(
                                    $mdDialog.alert()
                                        .parent(angular.element(document.body))
                                        .title(failedFBloginMessage)
                                        .content(error.message)
                                        .ariaLabel(failedFBloginMessage)
                                        .ok('Ok')
                                );
                            });
                    }, function (error) {
                        $scope.loggingInWithFB = false;

                        var failedFBloginMessageTitle = $translate.instant('view.auth.modal.loginFBFailed.title');
                        var failedFBloginMessageContent = $translate.instant('view.auth.modal.loginFBFailed.content');
                        $mdDialog.show(
                            $mdDialog.alert()
                                .parent(angular.element(document.body))
                                .title(failedFBloginMessageTitle)
                                .content(error && error.error ? error.error : failedFBloginMessageContent)
                                .ariaLabel(failedFBloginMessageTitle)
                                .ok('Ok')
                        );
                    });
                }, function () {
                    var failedFBloginMessageTitle = $translate.instant('view.auth.modal.loginFBFailed.title');
                    var failedFBloginMessageContent = $translate.instant('view.auth.modal.loginFBFailed.content');
                    $mdDialog.show(
                        $mdDialog.alert()
                            .parent(angular.element(document.body))
                            .title(failedFBloginMessageTitle)
                            .content(failedFBloginMessageContent)
                            .ariaLabel(failedFBloginMessageTitle)
                            .ok('Ok')
                    );
                });
        };

        /**
         * @ngdoc
         * @name AuthController#checkPasswordsMatch
         * @methodOf AuthController
         * @example
         * <pre><input required type="password" name="repass"ng-model="newUser.repass" ng-change="checkPasswordsMatch(registerForm)"/></pre>
         * @param {object} form - reset password form
         * @description
         * check if entered passwords match, sets form validity
         */
        $scope.checkPasswordsMatch = function (form) {
            if ($scope.newUser.pass !== $scope.newUser.repass) {
                form.repass.$setValidity('noMatch', false);
            }
            else {
                form.repass.$setValidity('noMatch', true);
            }
        };

        /**
         * @ngdoc
         * @name AuthController#resetPass
         * @methodOf AuthController
         * @example
         * <pre><md-button ng-click="resetPass(resetPassForm)">Reset password</md-button></pre>
         * @param {object} form - reset password form
         * @description
         * sends reset password email
         */
        $scope.resetPass = function (form) {
            form.$setSubmitted();
            if (form.$valid) {
                AuthService.resetPass($scope.resetData.resetPassEmail)
                    .then(function () {
                        $scope.resetMailSent = true;
                        LocalStorageService.remove('token');
                        var resetPassSuccessTitle = $translate.instant('view.auth.modal.resetPasswordSuccess.title');
                        var resetPasswordSuccessContent =
                            $translate.instant('view.auth.modal.resetPasswordSuccess.content');
                        $mdDialog.show(
                            $mdDialog.alert()
                                .parent(angular.element(document.body))
                                .title(resetPassSuccessTitle)
                                .content(resetPasswordSuccessContent)
                                .ariaLabel(resetPassSuccessTitle)
                                .ok('Ok')
                        ).then(function () {
                            $state.go('auth.login');
                        });

                    }, function (error) {
                        var resetPasswordFailed = $translate.instant('view.auth.modal.resetPasswordFailed');
                        $mdDialog.show(
                            $mdDialog.alert()
                                .parent(angular.element(document.body))
                                .title(resetPasswordFailed)
                                .content(error.message)
                                .ariaLabel(resetPasswordFailed)
                                .ok('Ok')
                        );
                    });
            }
        };

        /**
         * @ngdoc
         * @name AuthController#showTerms
         * @methodOf AuthController
         * @example
         * <pre><a ng-click="showTerms($event)">{{'views.auth.termsLink' | translate}}</a></pre>
         * @param {object} event - event object
         * @description
         * shows terms and conditions dialog
         */
        $scope.showTerms = function (event) {
            TermsDialog.show(event);
        };

        /**
         * @ngdoc
         * @name AuthController#showPrivacy
         * @methodOf AuthController
         * @example
         * <pre><a
         ng-click="showPrivacy($event)">{{'views.auth.privacyLink' | translate}}</a></pre>
         * @param {object} event - event object
         * @description
         * shows privacy dialog
         */
        $scope.showPrivacy = function (event) {
            PrivacyDialog.show(event);
        };

        $scope.init();
    }]);
