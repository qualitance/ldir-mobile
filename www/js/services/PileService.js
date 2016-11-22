angular.module('ServicesModule')
    /**
     * @ngdoc service
     * @service
     * @name Pile
     * @description The pile service
     * @requires $resource
     * @requires appConfig
     */
    .service('Pile', ['$resource', 'appConfig', function ($resource, appConfig) {
        return $resource(appConfig.serverUrl + 'piles/:action', {}, {
            query: {method: 'GET', isArray: true},
            details: {method: 'GET', isArray: false},
            create: {method: 'POST', isArray: false},
            update: {method: 'PUT', isArray: false},
            delete: {method: 'DELETE', isArray: false},
            queryMap: {
                method: 'GET', params: {
                    action: 'map'
                },
                isArray: true
            },
            confirm: {
                method: 'POST', params: {
                    action: 'pileConfirmation'
                },
                isArray: false
            }
        });
    }]);
