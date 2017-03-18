/**
 * @ngdoc service
 * @service
 * @name OfflineService
 * @description The offline mode service
 * @requires $window
 * @requires LocalStorageService
 * @requires Pile
 * @requires appConfig
 * @requires $cordovaFileTransfer
 * @requires $cordovaFile
 * @requires $rootScope
 * @requires $mdToast
 * @requires $translate
 * @requires CreatePileService
 */
angular.module('ServicesModule').factory('OfflineService', ['$window', 'LocalStorageService', 'Pile', 'appConfig',
    '$cordovaFileTransfer', '$cordovaFile', '$rootScope', '$mdToast', '$translate', 'CreatePileService',
    function ($window, LocalStorageService, Pile, appConfig,
              $cordovaFileTransfer, $cordovaFile, $rootScope, $mdToast, $translate, CreatePileService) {

        /**
         * @ngdoc
         * @name OfflineService#savePile
         * @methodOf OfflineService
         * @description
         * creates pile and removes it from queue
         */
        function savePile(pile) {
            CreatePileService.createPile(pile).then(function () {
                LocalStorageService.remove('queuedPiles');
                $mdToast.show($mdToast.simple().content($translate.instant('offlineService.pilesUploaded')));
            }, function () {
                $mdToast.show($mdToast.simple().content($translate.instant('errors.standard')));
            });
        }

        return {
            /**
             * @ngdoc
             * @name OfflineService#addToQueue
             * @methodOf OfflineService
             * @description
             * adds pile to queue
             */
            addToQueue: function (pile) {
                var queued = LocalStorageService.getObject('queuedPiles');
                if (queued != null) {
                    queued.push(pile);
                }
                else {
                    queued = [pile];
                }
                LocalStorageService.setObject('queuedPiles', queued);
            },

            /**
             * @ngdoc
             * @name OfflineService#uploadQueued
             * @methodOf OfflineService
             * @description
             * saves queued piles
             */
            uploadQueued: function () {
                var queued = LocalStorageService.getObject('queuedPiles');
                if (queued != null && queued.length) {
                    for (var i = 0; i < queued.length; i++) {
                        savePile(queued[i]);
                    }
                }
            }
        };
    }]);
