/**
 * @ngdoc service
 * @service
 * @name navbarSetup
 * @description navbar setup service
 * @requires $window
 */
angular.module('ServicesModule').factory('navbarSetup', ['$rootScope', function ($rootScope) {

    return {
        /**
         * @ngdoc method
         * @name navbarSetup#setBar
         * @methodOf navbarSetup
         * @description
         * configures navbar
         * @param {object} left - left side config object
         * @param {object} right - right side config object
         */
        setBar: function (left, right) {

            if (!left.action) {
                $rootScope.leftNavbarSide = {hasAction: false};
            }
            else {
                if (left.icon) {
                    $rootScope.leftNavbarSide = {
                        hasAction: true,
                        icon: left.icon,
                        hasIcon: true,
                        action: left.action
                    };
                }
                else {

                    $rootScope.leftNavbarSide = {
                        hasAction: true,
                        text: left.text,
                        hasIcon: false,
                        action: left.action
                    };
                }
            }
            if (!right.action) {
                $rootScope.rightNavbarSide = {hasAction: false};
            }
            else {
                if (right.icon) {
                    $rootScope.rightNavbarSide = {
                        hasAction: true,
                        icon: right.icon,
                        hasIcon: true,
                        action: right.action
                    };
                }
                else {

                    $rootScope.rightNavbarSide = {
                        hasAction: true,
                        text: right.text,
                        hasIcon: false,
                        action: right.action
                    };
                }
            }
        }
    };
}]);
