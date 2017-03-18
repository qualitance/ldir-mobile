angular.module('ServicesModule')
    /**
     * @ngdoc service
     * @service
     * @name Issue
     * @description The issue service
     * @requires $resource
     * @requires appConfig
     */
    .service('Issue', ['$resource', 'appConfig', function ($resource, appConfig) {
        'use strict';
        return $resource(appConfig.serverUrl + 'improves', {}, {
            create: {method: 'POST', isArray: false}
        });
    }]);
