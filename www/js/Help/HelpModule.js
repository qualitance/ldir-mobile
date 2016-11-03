angular.module('HelpModule', ['leaflet-directive'])
    .config(function ($stateProvider) {
        $stateProvider
            .state('app.help', {
                url: '/help',
                views: {
                    'main': {
                        templateUrl: 'js/Help/templates/help.html',
                        controller: 'HelpController'
                    }
                }
            })
            .state('app.reportissue', {
                url: '/reportissue',
                views: {
                    'main': {
                        templateUrl: 'js/Help/templates/reportIssue.html',
                        controller: 'ReportIssueController'
                    }
                }
            })
            .state('app.terms', {
                url: '/terms',
                views: {
                    'main': {
                        templateUrl: 'js/Help/templates/terms.html',
                        controller: 'TermsController'
                    }
                }
            })
            .state('app.privacy', {
                url: '/privacy',
                views: {
                    'main': {
                        templateUrl: 'js/Help/templates/privacy.html',
                        controller: 'PrivacyController'
                    }
                }
            });
    })
    .run();
