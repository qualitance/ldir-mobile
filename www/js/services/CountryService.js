(function (module) {
    'use strict';

    /**
     * @name CountryService
     * @description The get countries service
     * @requires $resource
     * @requires appConfig
     */
    module.factory('CountryService', CountryService);
    CountryService.$inject = ['$resource', 'appConfig'];
    function CountryService($resource, appConfig) {
        var countryResource = $resource(appConfig.serverUrl + 'countries/:id', {
            id: '@_id'
        });

        return {
            /**
             * @name CountryService#getCountries
             * @example
             * CountryService.getCountries();
             * @description
             * gets all countries
             * @returns {Promise} Resolves to an empty response/error
             */
            getCountries: function () {
                return countryResource.query().$promise;
            }
        };
    }
})(angular.module('ServicesModule'));
