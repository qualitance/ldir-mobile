angular.module('starter').controller('AppController', ['$scope', '$rootScope', 'LocalStorageService', '$state',
    '$mdSidenav', 'User', '$ionicSideMenuDelegate', 'appConfig', 'navbarSetup', '$mdToast', 'PushNotificationService',
    'AuthService', '$ionicScrollDelegate', '$cordovaFacebook', '$ionicHistory', '$timeout', '$translate',
    function ($scope, $rootScope, LocalStorageService, $state,
              $mdSidenav, User, $ionicSideMenuDelegate, appConfig, navbarSetup, $mdToast, PushNotificationService,
              AuthService, $ionicScrollDelegate, $cordovaFacebook, $ionicHistory, $timeout, $translate) {

        $scope.init = function () {
            $scope.checkRedirects();
            $scope.getUser();
            $scope.getStats();
        };

        $scope.getUser = function () {

            $rootScope.me = AuthService.getCurrentUser();
            $scope.currentUser = angular.copy($rootScope.me);

            if ($rootScope.online) {
                User.get().$promise.then(
                    function (user) {
                        $scope.currentUser = angular.copy(user);
                        AuthService.setCurrentUser(user);
                    },
                    function (error) {

                    });
            }
        };

        $scope.getStats = function () {
            User.stats().$promise.then(
                function (stats) {
                    $scope.stats = stats.piles;
                },
                function (error) {

                });
        };

        $scope.goToState = function (state) {
            $state.go(state);
            $scope.closeLeftNav();
        };

        $scope.goToQualitance = function () {
            window.open('https://www.qualitance.com/', '_system');
        };

        $scope.downloadOffline = function () {

        };

        $scope.logout = function () {

            $cordovaFacebook.logout();
            $timeout(function () {
                $ionicHistory.clearHistory();
                $ionicHistory.clearCache();
            }, 200);

            var cleanup = function () {
                $rootScope.token = null;
                LocalStorageService.remove('token');
                LocalStorageService.remove('me');
                LocalStorageService.remove('subscribed');
                LocalStorageService.remove('offlineCoordinates');
                LocalStorageService.remove('profilePhoto');
            };

            var notificationToken = LocalStorageService.get('notificationToken');
            PushNotificationService.unsubscribeDevice(notificationToken).then(function () {
                    cleanup();
                },
                function () {
                    cleanup();
                });

            $scope.closeLeftNav();
            $state.go('auth.login');

        };

        $scope.closeLeftNav = function () {
            $ionicSideMenuDelegate.toggleLeft();
        };

        $scope.toggleLeftSidenav = function () {
            $scope.getStats();
            $ionicSideMenuDelegate.toggleLeft();
        };

        $scope.scrollTop = function () {
            $ionicScrollDelegate.scrollTop();
        };

        $scope.toggleNotifications = function () {
            $scope.notificationsFlag = !$scope.notificationsFlag;

            User.save($rootScope.me).$promise.then(
                function () {
                },
                function () {
                    $mdToast.show($mdToast.simple().content($translate.instant('errors.standard')));
                });
        };

        $scope.checkRedirects = function () {
            var token = LocalStorageService.get('token');
            if (token === undefined || token == null) {
                $state.go('auth');
                return true;
            }
            else {
                $rootScope.token = token;

                if (!AuthService.hasProfileComplete() && $state.current.name !== 'app.help') {
                    $state.go('app.profile');
                    $mdToast.show($mdToast.simple().content($translate.instant('views.map.completeProfile')));
                    return true;
                }
                return false;
            }
        };

        $scope.getProfilePhoto = function () {
            var c = document.createElement('canvas');
            c.width = 200;
            c.height = 200;
            var ctx = c.getContext('2d');
            var img = document.getElementById('profilePhoto');
            ctx.drawImage(img, 0, 0);

            return c.toDataURL();
        };

        $rootScope.$watch('online', function () {
            if (!$rootScope.online && $rootScope.me.image) {
                if (!LocalStorageService.get('profilePhoto')) {
                    LocalStorageService.set('profilePhoto', $scope.getProfilePhoto());
                }
                $rootScope.me.image.src = LocalStorageService.get('profilePhoto');
            }
        });

        $rootScope.$on('$stateChangeStart', function (event, toState) {
            var token = LocalStorageService.get('token');
            if ((token === undefined || token == null) && !(toState.data && toState.data.allowsNonLoggedIn)) {
                event.preventDefault();
                $state.go('auth');
            }
            else {
                $rootScope.token = token;

                if (toState.name !== 'app.profile' && toState.name !== 'app.help' &&
                    !(toState.data && toState.data.allowsNonLoggedIn) && !AuthService.hasProfileComplete()) {
                    event.preventDefault();
                    $state.go('app.profile');
                    $mdToast.show($mdToast.simple().content($translate.instant('views.map.completeProfile')));
                }
            }
        });

        $rootScope.$on('ReloadStats', function () {
            $scope.getStats();
        });

        $rootScope.previousState = {};
        $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
            $rootScope.previousState.name = fromState.name;
            $rootScope.previousState.params = fromParams;
        });

        $rootScope.$on('ReloadStats', function () {
            $scope.getStats();
        });

        $scope.init();
    }
]);
