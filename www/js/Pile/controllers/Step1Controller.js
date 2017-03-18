/**
 * @ngdoc controller
 * @name Step1Controller
 * @description report pile step 1 controller
 * @property {Object} cameraOptions - camera options object
 * @requires $scope
 * @requires $rootScope
 * @requires navbarSetup
 * @requires $state
 * @requires $mdToast
 * @requires CommentsService
 * @requires $mdToast
 * @requires $cordovaCamera
 * @requires $cordovaImagePicker
 * @requires appConfig
 * @requires ZoomImagePopupDialog
 * @requires $ionicViewSwitcher
 * @requires $translate
 * @requires $q
 * @requires CreatePileService
 */
angular.module('PileModule').controller('Step1Controller', ['$scope', '$rootScope', 'navbarSetup', '$state', '$mdToast',
    '$cordovaCamera', '$cordovaImagePicker', 'appConfig', 'ZoomImagePopupDialog', '$ionicViewSwitcher', '$translate',
    '$q', 'CreatePileService',
    function ($scope, $rootScope, navbarSetup, $state, $mdToast,
              $cordovaCamera, $cordovaImagePicker, appConfig, ZoomImagePopupDialog, $ionicViewSwitcher, $translate,
              $q, CreatePileService) {

        $scope.$on('$ionicView.beforeEnter', function () {
            if ($scope.pile && $scope.pile.location) {
                $scope.$parent.$parent.pile.progressStep = 1;
            }
        });

        $scope.$on('$ionicView.afterEnter', function () {
            if ($scope.pile && $scope.pile.location) {
                $scope.$parent.$parent.pile.progressStep = 1;
            }
            else {
                $state.go('app.map');
                return;
            }

            $scope.scrollTopReportDiv();
        });

        var cameraOptions = {
            quality: 80,
            destinationType: appConfig.isMobile ? Camera.DestinationType.FILE_URI : null,
            sourceType: appConfig.isMobile ? Camera.PictureSourceType.CAMERA : null,
            targetWidth: 800,
            targetHeight: 600
        };

        /**
         * @ngdoc
         * @name Step1Controller#guid
         * @methodOf Step1Controller
         * @description
         * return globally unique identifier
         */
        function guid() {
            function _p8(s) {
                var p = (Math.random().toString(16) + '000000000').substr(2, 8);
                return s ? '-' + p.substr(0, 4) + '-' + p.substr(4, 4) : p;
            }

            return _p8() + _p8(true) + _p8(true) + _p8();
        }

        /**
         * @ngdoc
         * @name Step1Controller#movePhoto
         * @methodOf Step1Controller
         * @param {String} fileUri - uri of the file to move
         * @description
         * removes photo from systems temporary folder and moves it to cache folder
         */
        function movePhoto(fileUri) {
            var deferred = $q.defer();
            var fileExt = '.' + fileUri.split('.').pop();
            var newFileName = guid() + fileExt;
            window.resolveLocalFileSystemURL(
                fileUri,
                function (fileEntry) {
                    window.resolveLocalFileSystemURL(cordova.file.cacheDirectory,
                        function (dirEntry) {
                            // move the file to a new directory and rename it
                            fileEntry.moveTo(dirEntry, newFileName, function () {
                                deferred.resolve(cordova.file.cacheDirectory + newFileName);
                            }, function (error) {
                                deferred.reject(error);
                            });
                        },
                        function (error) {
                            deferred.reject(error);
                        }
                    );
                },
                function (error) {
                    deferred.reject(error);
                });
            return deferred.promise;
        }

        /**
         * @ngdoc
         * @name Step1Controller#takePhoto
         * @methodOf Step1Controller
         * @example
         * <pre><md-button ng-click="takePhoto()">Take Photo</md-button></pre>
         * @description
         * calls camera plugin to get picture object from camera
         */
        $scope.takePhoto = function () {
            if (appConfig.isMobile) {
                $cordovaCamera.getPicture(cameraOptions).then(function (imageUri) {
                    movePhoto(imageUri).then(function (result) {
                        var photo = {};
                        var timestamp = new Date();
                        photo.src = result;
                        photo.displaySrc = result + '?' + timestamp.getTime();
                        $scope.pile.photos.push(photo);
                        if (!$scope.pile.new) {
                            $scope.pile.hasReachedLastStep = true;
                        }
                    }, function (error) {
                    });
                }, function () {
                    $mdToast.show($mdToast.simple().content($translate.instant('errors.standard')));
                });
            }
            else {
                $scope.pile.photos.push({src: 'http://farm9.staticflickr.com/8378/8559402848_9fcd90d20b_b.jpg'});
            }
        };

        /**
         * @ngdoc
         * @name Step1Controller#uploadPhoto
         * @methodOf Step1Controller
         * @example <pre><md-button ng-click="uploadPhoto()">Upload Photo</md-button></pre>
         * @description
         * calls camera plugin to get pictures objects from gallery
         */
        $scope.uploadPhoto = function () {
            if (appConfig.isMobile) {
                var options = angular.copy(appConfig.imagePickerOptions);
                options.maximumImagesCount = angular.copy(appConfig.imagePickerOptions.maximumImagesCount -
                    $scope.pile.photos.length);
                $cordovaImagePicker.getPictures(options)
                    .then(function (results) {
                        for (var i = 0; i < results.length; i++) {
                            movePhoto(results[i]).then(function (result) {
                                var photo = {};
                                photo.src = result;
                                photo.displaySrc = result;
                                $scope.pile.photos.push(photo);
                            }, function (error) {
                            });
                        }
                    }, function () {
                        $mdToast.show($mdToast.simple().content($translate.instant('errors.standard')));
                    });
            }
            else {
                $scope.pile.photos.push({src: 'http://farm9.staticflickr.com/8378/8559402848_9fcd90d20b_b.jpg'});
            }
        };

        /**
         * @ngdoc
         * @name Step1Controller#removePhoto
         * @methodOf Step1Controller
         * @example <pre><md-button ng-click="removePhoto()">Take Photo</md-button></pre>
         * @description
         * remove photo from system cache folder and photos array
         */
        $scope.removePhoto = function (index) {
            CreatePileService.clearCachedPhoto($scope.pile.photos[index].src);
            $scope.pile.photos.splice(index, 1);
            if (!$scope.pile.photos.length) {
                $scope.pile.hasReachedLastStep = false;
            }
        };

        /**
         * @ngdoc
         * @name Step1Controller#zoomImage
         * @methodOf Step1Controller
         * @example
         * <pre> <a ng-click="zoomImage(image.src)"><img data-ng-src="{{ image.src }}"alt="image{{ $index }}"></a></pre>
         * @param {String} image - image url
         * @description
         * open zoom modal for specific pile image
         */
        $scope.zoomImage = function (image) {
            if (image) {
                ZoomImagePopupDialog.show(null, image);
            }
        };

        /**
         * @ngdoc
         * @name Step1Controller#goToStep2
         * @methodOf Step1Controller
         * @example
         * <pre><button ng-click="goToStep2()">...</button></pre>
         * @description
         * redirects to report pile step 2 if the pile has at least 1 photo
         */
        $scope.goToStep2 = function () {
            if (!$scope.pile.photos.length) {
                $mdToast.show($mdToast.simple().content($translate.instant('views.pile.step1.content')));
                return;
            }
            $state.go('app.pile.step2');
        };

        /**
         * @ngdoc
         * @name Step1Controller#goBack
         * @methodOf Step1Controller
         * @example
         * <pre><button ng-click="goBack()">...</button></pre>
         * @description
         * redirects to map and clears cache photos
         */
        $scope.goBack = function () {
            angular.forEach($scope.pile.photos, function (image) {
                CreatePileService.clearCachedPhoto(image.src);
            });
            $ionicViewSwitcher.nextDirection('back');
            $state.go('app.map');
        };

        $scope.onSwipeRight = function () {
            $scope.goBack();
        };
        $scope.onSwipeLeft = function () {
            $scope.goToStep2();
        };

    }]);
