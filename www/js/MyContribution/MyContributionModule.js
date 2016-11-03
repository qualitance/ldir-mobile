angular.module('MyContributionModule', [])
    .config(function ($stateProvider) {
        $stateProvider
            .state('app.mycontribution', {
                url: '/mycontribution',
                views: {
                    'main': {
                        templateUrl: 'js/MyContribution/templates/mycontribution.html',
                        controller: 'MyContributionController'
                    }
                }
            });
    });
