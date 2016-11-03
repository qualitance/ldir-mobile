angular.module('ServicesModule').factory('OfflineService', ['$window', 'LocalStorageService', 'Pile', 'appConfig',
    '$cordovaFileTransfer', '$cordovaFile', '$rootScope', '$mdToast', '$translate', 'CreatePileService',
    function ($window, LocalStorageService, Pile, appConfig,
              $cordovaFileTransfer, $cordovaFile, $rootScope, $mdToast, $translate, CreatePileService) {

        function savePile(pile) {
            CreatePileService.createPile(pile).then(function () {
                LocalStorageService.remove('queuedPiles');
                $mdToast.show($mdToast.simple().content($translate.instant('offlineService.pilesUploaded')));
            }, function () {
                $mdToast.show($mdToast.simple().content($translate.instant('errors.standard')));
            });
        }

        return {
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
