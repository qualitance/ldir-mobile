angular.module('ProfileModule', [])
    .config(function ($stateProvider) {

        $stateProvider
            .state('app.profile', {
                url: '/profile',
                views: {
                    'main': {
                        templateUrl: 'js/Profile/templates/profile.html',
                        controller: 'ProfileController'
                    }
                }
            })
        ;
    })
    .run();
