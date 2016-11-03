angular.module('MapModule', ['leaflet-directive'])
    .config(function ($stateProvider) {
        $stateProvider
            .state('app.map', {
                url: '/map',
                views: {
                    'main': {
                        templateUrl: 'js/Map/templates/map.html',
                        controller: 'MapController'
                    }
                },
                params: {
                    location: null
                }
            })
            .state('app.map.download', {
                url: '/:download',
                views: {
                    'main': {
                        templateUrl: 'js/Map/templates/map.html',
                        controller: 'MapController'
                    }
                },
                params: {
                    location: null
                }
            });
    })
    .run();
