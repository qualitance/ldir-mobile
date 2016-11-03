angular.module('ServicesModule')
    .factory('User', ['$resource', 'appConfig', function ($resource, appConfig) {
        return $resource(appConfig.serverUrl + 'users/:action', {},
            {
                resendActivation: {
                    method: 'POST', params: {
                        action: 'resendActivation'
                    }
                },
                fpw: {
                    method: 'POST', params: {
                        action: 'fpw'
                    }
                },
                save: {
                    method: 'PUT', params: {
                        action: 'me'
                    }
                },
                changePassword: {
                    method: 'PUT',
                    params: {
                        action: 'password'
                    }
                },
                get: {
                    method: 'GET',
                    params: {
                        action: 'me'
                    }
                },
                setPassword: {
                    method: 'POST',
                    params: {
                        action: 'set_password'
                    }
                },
                stats: {method: 'GET', isArray: false, params: {action: 'stats'}}
            });
    }]);
