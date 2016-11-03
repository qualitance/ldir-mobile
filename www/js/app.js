var app = angular.module('starter', ['ngRaven', 'ionic', 'ngCordova', 'ngMessages', 'ngMaterial', 'AuthModule',
        'MapModule', 'PileModule', 'MyContributionModule', 'ServicesModule', 'HelpModule', 'ProfileModule',
        'NotificationsModule', 'ngResource', 'TemplateDirectivesModule', 'angulartics', 'angulartics.piwik',
        'pascalprecht.translate', 'ngFileUpload'])
    .factory('authInterceptor', function ($rootScope, $q, LocalStorageService, $location, $analytics) {
        return {
            request: function (config) {
                config.headers = config.headers || {};
                var token = LocalStorageService.get('token');
                if (token) {
                    config.headers.Authorization = 'Bearer ' + token;
                }
                return config;
            },

            response: function (response) {

                if (response.config.url.indexOf('.html') === -1) {
                    $analytics.eventTrack(response.config.url, {
                        category: 'Application responses',
                        label: JSON.stringify(response.data),
                        name: JSON.stringify(response.data)
                    });
                }
                return response;
            },

            responseError: function (response) {

                $analytics.eventTrack(response.statusText + '' + response.status, {
                    category: 'API Errors',
                    label: response.config.url,
                    method: response.config.method,
                    value: response.status,
                    text: response.statusText
                });

                if (response.status === 401) {
                    $location.path('/auth/login');
                    LocalStorageService.remove('token');

                    response.isAuthError = true;

                    return $q.reject(response);
                }
                else {
                    return $q.reject(response);
                }
            }
        };
    })
    .factory('dataFormatInterceptor', function ($q) {
        return {

            response: function (response) {
                if (response.headers('Content-Type') === 'application/json') {
                    if (response.data.data) {
                        response.data = response.data.data.success ? response.data.data.success : response.data.data;
                    }
                }
                return response;
            },

            responseError: function (response) {
                if (response.headers('Content-Type') === 'application/json') {
                    if (response.data.data) {
                        response.data = response.data.data.error ? response.data.data.error : response.data.data;
                    }
                }
                return $q.reject(response);
            }
        };
    })

    .config(function ($provide) {
        $provide.decorator('$exceptionHandler', ['$delegate', '$analytics',
            function ($delegate, $analytics) {
                return function (exception, cause) {
                    $analytics.eventTrack('ERROR', {category: 'Exception Handler', label: exception, value: exception});
                    $delegate(exception, cause);
                };
            }
        ]);
    })

    .run(function ($ionicPlatform, $rootScope, LocalStorageService, $state, appConfig, PushNotificationService,
                   $mdSidenav, $cordovaNetwork, OfflineService, $ionicConfig, $cordovaGoogleAnalytics, $q, $location,
                   $cordovaGlobalization, $translate) {

        $rootScope.isIos = appConfig.isIos;

        var token = LocalStorageService.get('token');
        var fbUser = LocalStorageService.get('fbUser');
        if (!token) {
            $location.path('/auth/login');
        }

        $rootScope.platformReadyDefered = $q.defer();

        $ionicPlatform.ready(function () {

            $rootScope.platformReady = true;
            $rootScope.platformReadyDefered.resolve();

            if (window.cordova && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
                window.cordova.plugins.Keyboard.disableScroll(true);
            }
            if (window.StatusBar) {
                StatusBar.styleDefault();
            }

            if (ionic.Platform.grade === 'c') {
                $ionicConfig.views.transition('none');
            }

            $rootScope.deviceSubscribed = LocalStorageService.get('subscribed');
            $rootScope.notificationToken = null;
            $rootScope.online = true;

            if (appConfig.isMobile) {

                $rootScope.online = $cordovaNetwork.isOnline();

                if ($rootScope.online) {
                    OfflineService.uploadQueued();
                }

                $rootScope.$on('$cordovaNetwork:online', function (event, networkState) {
                    OfflineService.uploadQueued();
                    var onlineState = networkState;
                    $rootScope.online = true;
                    $rootScope.$broadcast('ReloadPiles');
                });

                $rootScope.$on('$cordovaNetwork:offline', function (event, networkState) {
                    var offlineState = networkState;
                    $rootScope.online = false;
                });

                PushNotificationService.init();

                // back button config
                document.addEventListener('backbutton', function () {
                    if ($state.is('app.map') || $state.current.name.indexOf('auth') !== -1) {
                        navigator.app.exitApp();
                    }
                }, false);

                $cordovaGlobalization.getPreferredLanguage().then(
                    function (result) {
                        var language = '';
                        if (result.value.indexOf('-') !== -1) {
                            language = result.value.substr(0, result.value.indexOf('-')).toLowerCase();
                        }
                        else {
                            language = result.value.toLowerCase();
                        }
                        if ($translate.getAvailableLanguageKeys().indexOf(language) !== -1) {
                            $translate.use(language);
                        }
                        $rootScope.documentLoaded = true;
                    });
            }
        });
    })

    .config(function ($stateProvider, $urlRouterProvider, $httpProvider, $mdGestureProvider) {

        $stateProvider
            .state('app', {
                url: '/app',
                abstract: true,
                templateUrl: 'templates/main.html',
                controller: 'AppController'
            });

        $urlRouterProvider.otherwise('app/map');

        $httpProvider.interceptors.push('authInterceptor');
        $httpProvider.interceptors.push('dataFormatInterceptor');
        $mdGestureProvider.skipClickHijack();

    })
    .config(function ($translateProvider) {

        $translateProvider.useStaticFilesLoader({
            prefix: 'resources/locale-',
            suffix: '.json'
        });
        $translateProvider.registerAvailableLanguageKeys(
            ['en', 'ro'],
            {
                'en*': 'en',
                'ro*': 'ro'
            }
        );
        $translateProvider.preferredLanguage('ro');
    });
