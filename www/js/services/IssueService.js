angular.module('ServicesModule')
    .service('Issue', ['$resource', 'appConfig', function ($resource, appConfig) {
        'use strict';
        return $resource(appConfig.serverUrl + 'improves', {}, {
            create: {method: 'POST', isArray: false}
        });
    }]);
