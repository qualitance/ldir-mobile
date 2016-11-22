/**
 * @ngdoc service
 * @service
 * @name PushNotificationService
 * @description The push notification service
 * @requires appConfig
 * @requires $cordovaPush
 * @requires $q
 * @requires $http
 * @requires AuthService
 * @requires LocalStorageService
 * @requires $mdDialog
 * @requires $timeout
 * @requires $translate
 */
angular.module('ServicesModule').factory('PushNotificationService', ['appConfig', '$cordovaPush', '$rootScope', '$q',
    '$http', 'AuthService', 'LocalStorageService', '$mdDialog', '$timeout', '$translate',
    function (appConfig, $cordovaPush, $rootScope, $q,
              $http, AuthService, LocalStorageService, $mdDialog, $timeout, $translate) {
        var flag = true;

        /**
         * @ngdoc
         * @name PushNotificationService#subscribe
         * @methodOf PushNotificationService
         * @param {String} deviceType - device type
         * @param {String} deviceToken - device token
         * @description
         * subscribe device to push notifications
         * @returns {Promise} Resolves to an empty response/error
         */
        var subscribe = function (deviceType, deviceToken) {

            var deferred = $q.defer(),
                deferredResponse = {};

            var req = {
                method: 'POST',
                url: appConfig.serverUrl + 'users/subscribeDevice',
                data: {
                    deviceType: deviceType,
                    deviceToken: deviceToken
                }
            };

            $http(req)
                .success(function () {
                    deferred.resolve(deferredResponse);
                    $rootScope.deviceSubscribed = true;
                    LocalStorageService.set('subscribed', true);
                })
                .error(function () {
                    deferredResponse.message = 'Subscribe device failed';
                    deferred.reject(deferredResponse);
                });

            return deferred.promise;

        };

        /**
         * @ngdoc
         * @name PushNotificationService#unsubscribe
         * @methodOf PushNotificationService
         * @param {String} deviceType - device type
         * @param {String} deviceToken - device token
         * @description
         * unsubscribe device to push notifications
         * @returns {Promise} Resolves to an empty response/error
         */
        var unsubscribe = function (deviceToken) {
            var deferred = $q.defer(),
                deferredResponse = {};

            var req = {
                method: 'POST',
                url: appConfig.serverUrl + 'users/unsubscribeDevice',
                data: {
                    deviceToken: deviceToken
                }
            };

            $http(req)
                .success(function () {
                    deferred.resolve(deferredResponse);
                })
                .error(function () {
                    deferredResponse.message = 'Unsubscribe device failed';
                    deferred.reject(deferredResponse);
                });

            return deferred.promise;

        };

        return {
            init: function () {
                if (appConfig.isMobile && $rootScope.online) {
                    if (appConfig.isIos) {
                        $cordovaPush
                            .register(appConfig.iosConfig)
                            .then(function (token) {
                                $rootScope.notificationToken = token;
                                LocalStorageService.set('notificationToken', $rootScope.notificationToken);
                                if (AuthService.isLoggedIn() && !$rootScope.deviceSubscribed) {
                                    subscribe('ios', $rootScope.notificationToken);
                                }
                            }, function (err) {
                            });

                        // BIND EVENT
                        $rootScope.$on('$cordovaPush:notificationReceived', function (event, notification) {
                            if (notification.alert) {
                                navigator.notification.alert(notification.alert);
                                $rootScope.$broadcast('ReloadStats');
                            }

                            if (notification.badge) {
                                $cordovaPush.setBadgeNumber(notification.badge)
                                    .then(function (result) {
                                    }, function (err) {
                                    });
                            }
                        });
                    }
                    else if (!appConfig.isIos) {
                        $cordovaPush.register(appConfig.androidConfig).then(function (result) {
                        }, function (err) {
                        });

                        //BIND EVENT
                        $rootScope.$on('$cordovaPush:notificationReceived', function (event, notification) {
                            switch (notification.event) {
                                case 'registered':
                                    if (notification.regid.length > 0) {
                                        $rootScope.notificationToken = notification.regid;
                                        LocalStorageService.set('notificationToken', $rootScope.notificationToken);
                                        if (AuthService.isLoggedIn() && !$rootScope.deviceSubscribed) {
                                            subscribe('android', $rootScope.notificationToken);
                                        }
                                    }
                                    break;

                                case 'message':
                                    // this is the actual push notification
                                    // its format depends on the data model from the push server
                                    if (flag) {
                                        flag = false;

                                        $mdDialog.show(
                                            $mdDialog.alert()
                                                .clickOutsideToClose(true)
                                                .title($translate.instant('menu.item.notifications'))
                                                .content(notification.message)
                                                .ariaLabel('Notification')
                                                .ok('Got it!')
                                        );

                                        $timeout(function () {
                                            flag = true;
                                        }, 3000);
                                    }

                                    $rootScope.$broadcast('ReloadStats');
                                    break;
                            }
                        });
                    }
                }
            },

            subscribeDevice: subscribe,

            unsubscribeDevice: unsubscribe
        };
    }]);
