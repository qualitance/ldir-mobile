(function (module) {
    'use strict';

    /**
     * @ngdoc service
     * @service
     * @name CreatePileService
     * @description maps and uploads pile object and files
     * @requires Upload
     * @requires $q
     * @requires appConfig
     * @requires $cordovaFile
     * $rootScope
     * */
    module.service('CreatePileService', CreatePileService);
    CreatePileService.$inject = ['Upload', '$q', 'appConfig', '$cordovaFile', '$rootScope'];
    function CreatePileService(Upload, $q, appConfig, $cordovaFile, $rootScope) {

        /**
         * @name CreatePileService#createPile
         * @example
         * CreatePileService.createPile(pile);
         * @description
         * maps and uploads pile object and files
         * @returns {Promise} Resolves to an empty response/error
         */
        this.createPile = function (pile) {
            var deferred = $q.defer();
            createBlobs(pile).then(function (result) {
                Upload.upload({
                    url: appConfig.serverUrl + 'piles',
                    data: {
                        'pile': pile,
                        file: result
                    }
                }).success(function (data) {
                    $rootScope.$broadcast('ReloadPiles');
                    clearAllPhotos(pile);
                    deferred.resolve(data);
                }).error(function () {
                    clearAllPhotos(pile);
                    deferred.reject();
                });
            }, function () {
                deferred.reject();
            });
            return deferred.promise;
        };

        /**
         * @name CreatePileService#createBlobs
         * @example
         * createPile(pile);
         * @description
         * creates blobs for each image file
         * @returns {Promise} Resolves to an empty response/error
         */
        function createBlobs(pile) {
            var promises = [];
            angular.forEach(pile.photos, function (image) {
                var deferred = $q.defer();
                window.resolveLocalFileSystemURL(image.src, function (fileEntry) {
                    fileEntry.file(function (file) {
                        var type = file.name.split('.').pop();
                        var reader = new FileReader();
                        reader.onloadend = function () {
                            var imgBlob = new Blob([this.result], {type: type});
                            deferred.resolve(imgBlob);
                        };
                        reader.readAsArrayBuffer(file);
                    }, function () {
                        deferred.reject();
                    });
                }, function () {
                    deferred.reject();
                });
                promises.push(deferred.promise);
            });
            return $q.all(promises);
        }

        /**
         * @name CreatePileService#clearCachedPhoto
         * @example
         * clearCachedPhoto(image.src);
         * @description
         * removes image file from cache folder
         * @returns {Promise} Resolves to an empty response/error
         */
        function clearCachedPhoto(fileUri) {
            var filename = fileUri.substring(fileUri.lastIndexOf('/') + 1, fileUri.length);
            return $cordovaFile.removeFile(cordova.file.cacheDirectory, filename);
        }

        this.clearCachedPhoto = clearCachedPhoto;

        /**
         * @name CreatePileService#clearAllPhotos
         * @example
         * clearAllPhotos(pile);
         * @description
         * removes all image files from cache folder and cleans up the camera
         * @returns {Promise} Resolves to an empty response/error
         */
        function clearAllPhotos(pile) {
            var promises = [];
            angular.forEach(pile.photos, function (image) {
                promises.push(clearCachedPhoto(image.src));
            });
            return $q.all(promises);
        }

    }
})(angular.module('ServicesModule'));
