angular.module('ServicesModule')
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
