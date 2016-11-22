angular.module('ServicesModule')
    /**
     * @ngdoc service
     * @service
     * @name Activity
     * @description The activity service
     * @requires $resource
     * @requires appConfig
     */
    .service('Activity', ['$resource', 'appConfig', function ($resource, appConfig) {
        'use strict';
        return $resource(appConfig.serverUrl + 'activities/:action', {}, {
            query: {method: 'GET', isArray: true},
            viewed: {method: 'POST', isArray: false, params: {action: 'viewed'}}
        });
    }]);
