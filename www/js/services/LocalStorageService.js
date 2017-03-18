/**
 * @ngdoc service
 * @service
 * @name LocalStorageService
 * @description The local storage service
 * @requires $window
 */
angular.module('ServicesModule').factory('LocalStorageService', ['$window', function ($window) {
    return {
        set: function (key, value) {
            $window.localStorage[key] = value;
        },
        get: function (key, defaultValue) {
            return $window.localStorage[key] || defaultValue;
        },
        setObject: function (key, value) {
            $window.localStorage[key] = JSON.stringify(value);
        },
        getObject: function (key) {
            return JSON.parse($window.localStorage[key] || null);
        },
        remove: function (key) {
            $window.localStorage.removeItem(key);
        }
    };
}]);
