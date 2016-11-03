(function (module) {
    'use strict';

    /**
     * @ngdoc service
     * @service
     * @name MarkerHelperService
     * @description configures marker for given pile
     * @requires $rootScope
     * @requires LocalStorageService

     * */
    module.service('MarkerHelperService', MarkerHelperService);
    MarkerHelperService.$inject = ['$rootScope', 'LocalStorageService','$state','$mdToast','$translate'];
    function MarkerHelperService($rootScope, LocalStorageService, $state, $mdToast, $translate) {

        /**
         * @name MarkerHelperService#configPileMarker
         * @example
         * MarkerHelperService.configPileMarker(pile);
         * @description
         * configures marker for given pile
         * @returns pileMarker
         */
        this.configPileMarker = function (pile) {
            var pileMarker = {};
            pileMarker.lat = pile.location.lat;
            pileMarker.lng = pile.location.lng;
            pileMarker.id = pile._id;
            pileMarker.layer = 'Piles';
            pileMarker.draggable = false;
            pileMarker.focus = false;
            pileMarker.enable = [];

            pileMarker.icon = {
                iconUrl: 'img/pins/red.svg',
                iconSize: [55, 60],
                shadowSize: [50, 64],
                iconAnchor: [25, 56],
                shadowAnchor: [4, 62],
                popupAnchor: [2, -50] // point from which the popup should open relative to the iconAnchor
            };

            var me = $rootScope.me || LocalStorageService.getObject('me');
            if (!me) {
                $state.go('auth.login');
                $mdToast.show($mdToast.simple().content($translate.instant('views.map.sessionExpired')));
            }

            switch (pile.status) {
                case 'confirmed':
                    pileMarker.icon.iconUrl = pile.user === me._id ? 'img/pins/3_3.svg' : 'img/pins/3.svg';
                    break;
                case 'pending':
                    pileMarker.icon.iconUrl = pile.user === me._id ? 'img/pins/5_5.svg' : 'img/pins/5.svg';
                    break;
                case 'clean':
                    pileMarker.icon.iconUrl = pile.user === me._id ? 'img/pins/1_1.svg' : 'img/pins/1.svg';
                    break;
                case 'unconfirmed':
                    pileMarker.icon.iconUrl = pile.user === me._id ? 'img/pins/4_4.svg' : 'img/pins/4.svg';
                    break;
                case 'reported':
                    pileMarker.icon.iconUrl = pile.user === me._id ? 'img/pins/2_2.svg' : 'img/pins/2.svg';
                    break;
            }

            pileMarker.size = pile.size;
            pileMarker.nr_ord = pile.nr_ord;
            pileMarker.status = pile.status;
            pileMarker.content = pile.content;

            return pileMarker;
        };
    }

})(angular.module('ServicesModule'));
