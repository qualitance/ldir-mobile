angular.module('ServicesModule')
    .service('Activity', ['$resource', 'appConfig', function ($resource, appConfig) {
        'use strict';
        return $resource(appConfig.serverUrl + 'activities/:action', {}, {
            query: {method: 'GET', isArray: true},
            viewed: {method: 'POST', isArray: false, params: {action: 'viewed'}}
        });
    }]);
