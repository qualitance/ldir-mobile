angular.module('ServicesModule').factory('navbarSetup', ['$rootScope', function ($rootScope) {

    return {
        setBar: function (left, right) {

            // SET LEFT SIDE
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
            // SET RIGHT SIDE
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
