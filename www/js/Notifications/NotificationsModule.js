angular.module('NotificationsModule', [])
    .config(function ($stateProvider) {
        $stateProvider
            .state('app.notifications', {
                url: '/notifications',
                views: {
                    'main': {
                        templateUrl: 'js/Notifications/templates/notifications.html',
                        controller: 'NotificationsController'
                    }
                }
            });
    });
