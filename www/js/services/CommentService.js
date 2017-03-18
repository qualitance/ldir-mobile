angular.module('ServicesModule')
    /**
     * @ngdoc service
     * @service
     * @name CommentsService
     * @description The comments service
     * @requires $resource
     * @requires appConfig
     */
    .factory('CommentsService', ['$resource', 'appConfig', function ($resource, appConfig) {
        'use strict';
        return $resource(appConfig.serverUrl + 'comments', {},
            {
                query: {
                    method: 'GET',
                    isArray: true
                },
                create: {
                    method: 'POST'
                }
            });
    }]);
