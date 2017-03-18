/**
 * @ngdoc service
 * @service
 * @name AuthService
 * @description The authentication service
 * @requires $log
 * @requires $http
 * @requires $q
 * @requires appConfig
 * @requires LocalStorageService
 * @requires $rootScope
 * @requires $translate
 */
angular.module('ServicesModule').service('AuthService', ['$log', '$http', '$q', 'appConfig', 'LocalStorageService',
    '$rootScope', '$translate',
    function ($log, $http, $q, appConfig, LocalStorageService, $rootScope, $translate) {

        var _authService = {};

        /**
         * @ngdoc
         * @name AuthService#login
         * @methodOf AuthService
         * @example
         * AuthService.login(email, password);
         * @description
         * Tries to login a user
         * @returns {Promise} Resolves to an empty response/error
         */
        _authService.login = function (email, password) {

            var deferred = $q.defer(),
                deferredResponse = {};

            var req = {
                method: 'POST',
                url: appConfig.authUrl + 'local',
                data: {
                    email: email,
                    password: password
                }
            };

            $http(req)
                .success(function (data) {
                    deferredResponse.token = data.token;
                    deferredResponse.user = data.user;
                    deferred.resolve(deferredResponse);
                })
                .error(function (data, status) {
                    switch (status) {
                        case 401:
                            deferredResponse.message = $translate.instant('auth.notYetVerified');
                            if (data) {
                                deferredResponse.message = data.message;
                                deferredResponse.data = data;
                            }
                            deferredResponse.requireVerification = true;
                            break;
                        case 403:
                            deferredResponse.message = $translate.instant('auth.emailOrPasswordError');
                            break;
                        default:
                            deferredResponse.message = $translate.instant('errors.standard');
                            break;
                    }

                    deferred.reject(deferredResponse);
                });

            return deferred.promise;
        };

        /**
         * @ngdoc
         * @name AuthService#register
         * @methodOf AuthService
         * @example
         * AuthService.register(firstName, lastName, email, password);
         * @description
         * Tries to register a user
         * @returns {Promise} Resolves to an empty response/error
         */
        _authService.register = function (firstName, lastName, email, pass) {
            var deferred = $q.defer(),
                deferredResponse = {};

            var req = {
                method: 'POST',
                url: appConfig.serverUrl + 'users',
                data: {
                    first_name: firstName,
                    last_name: lastName,
                    email: email,
                    password: pass,
                    language: $translate.use()
                }
            };

            $http(req)
                .success(function () {
                    deferred.resolve(deferredResponse);
                })
                .error(function (data, status) {

                    switch (status) {
                        case 422:
                            deferredResponse.message = $translate.instant('auth.mailAlreadyRegistered');
                            break;
                        default:
                            deferredResponse.message = $translate.instant('auth.mailAccountError');
                            break;
                    }

                    deferred.reject(deferredResponse);
                });

            return deferred.promise;
        };

        /**
         * @ngdoc
         * @name AuthService#fbLogin
         * @methodOf AuthService
         * @example
         * AuthService.fbLogin(userId, accessToken);
         * @description
         * Tries to login a user with facebook
         * @returns {Promise} Resolves to an empty response/error
         */
        _authService.fbLogin = function (userId, accessToken) {

            var deferred = $q.defer(),
                deferredResponse = {};

            var req = {
                method: 'POST',
                url: appConfig.authUrl + 'mobile/facebook',
                data: {
                    userId: userId,
                    accessToken: accessToken
                }
            };

            $http(req)
                .success(function (data) {
                    deferredResponse.token = data.token;
                    deferredResponse.user = data.user;
                    deferred.resolve(deferredResponse);
                })
                .error(function (data) {
                    deferredResponse = data;
                    deferred.reject(deferredResponse);
                });

            return deferred.promise;
        };

        /**
         * @ngdoc
         * @name AuthService#resetPass
         * @methodOf AuthService
         * @example
         * AuthService.resetPass(email);
         * @description
         * Tries to resets a user password
         * @returns {Promise} Resolves to an empty response/error
         */
        _authService.resetPass = function (email) {

            var deferred = $q.defer(),
                deferredResponse = {};

            var req = {
                method: 'POST',
                url: appConfig.serverUrl + 'users/fpw',
                data: {
                    email: email
                }
            };

            $http(req)
                .success(function () {
                    deferred.resolve(deferredResponse);
                })
                .error(function (data, status) {

                    switch (status) {
                        case 404:
                            deferredResponse.message = $translate.instant('auth.mailNotRegistered');
                            break;
                        case 403:
                            deferredResponse.message = data;
                            break;
                        default:
                            deferredResponse.message = $translate.instant('auth.resetPassword');
                            break;
                    }

                    deferred.reject(deferredResponse);
                });

            return deferred.promise;
        };

        /**
         * @ngdoc
         * @name AuthService#resendActivation
         * @methodOf AuthService
         * @example
         * AuthService.resendActivation(email);
         * @description
         * Tries to resend activation email
         * @returns {Promise} Resolves to an empty response/error
         */
        _authService.resendActivation = function (email) {

            var deferred = $q.defer(),
                deferredResponse = {};

            var req = {
                method: 'POST',
                url: appConfig.serverUrl + 'users/resendActivation',
                data: {
                    email: email
                }
            };

            $http(req)
                .success(function () {
                    deferred.resolve(deferredResponse);
                })
                .error(function (data, status) {

                    switch (status) {
                        case 404:
                            deferredResponse.message = $translate.instant('auth.mailNotRegistered');
                            break;
                        default:
                            deferredResponse.message = $translate.instant('auth.mailNotResend');
                            break;
                    }

                    deferred.reject(deferredResponse);
                });

            // deferred.resolve();
            return deferred.promise;
        };

        _authService.getToken = function () {
            return LocalStorageService.get('token');
        };

        _authService.isLoggedIn = function () {
            return LocalStorageService.get('token', null) !== null;
        };

        /**
         * @ngdoc
         * @name AuthService#hasProfileComplete
         * @methodOf AuthService
         * @example
         * AuthService.hasProfileComplete();
         * @returns {Boolean} Returns true if user has profile complete
         */
        _authService.hasProfileComplete = function () {

            var user = _authService.getCurrentUser();
            return !!(user &&
            user.phone &&
            user.first_name &&
            user.last_name &&
            user.county);
        };

        _authService.getCurrentUser = function () {
            return $rootScope.me || LocalStorageService.getObject('me');
        };

        _authService.setCurrentUser = function (user) {
            $rootScope.me = user;
            LocalStorageService.setObject('me', user);
        };

        return _authService;
    }]);
