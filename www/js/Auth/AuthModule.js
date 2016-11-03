angular.module('AuthModule', [])
    .config(function ($stateProvider) {
        $stateProvider
            .state('auth', {
                url: '/auth',
                template: '<ion-nav-view></ion-nav-view>',
                controller: 'AuthController',
                data: {
                    allowsNonLoggedIn: true
                }
            })
            .state('auth.login', {
                url: '/login',
                templateUrl: 'js/Auth/templates/authmain.html',
                controller: 'AuthController',
                data: {
                    allowsNonLoggedIn: true
                }
            })
            .state('auth.resetpass', {
                url: '/resetpass',
                templateUrl: 'js/Auth/templates/resetPass.html',
                controller: 'AuthController',
                data: {
                    allowsNonLoggedIn: true
                }
            });
    }).run(function ($state, $rootScope) {
    $rootScope.$on('$stateChangeSuccess',
        function (event, toState, toParams, fromState, fromParams) {
            if (toState.name === 'auth') {
                $state.go('auth.login');
            }
        });
});

