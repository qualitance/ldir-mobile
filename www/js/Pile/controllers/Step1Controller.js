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

        function guid() {
            function _p8(s) {
                var p = (Math.random().toString(16) + '000000000').substr(2, 8);
                return s ? '-' + p.substr(0, 4) + '-' + p.substr(4, 4) : p;
            }

            return _p8() + _p8(true) + _p8(true) + _p8();
        }

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

        $scope.removePhoto = function (index) {
            CreatePileService.clearCachedPhoto($scope.pile.photos[index].src);
            $scope.pile.photos.splice(index, 1);
            if (!$scope.pile.photos.length) {
                $scope.pile.hasReachedLastStep = false;
            }
        };

        $scope.zoomImage = function (image) {
            if (image) {
                ZoomImagePopupDialog.show(null, image);
            }
        };

        $scope.goToStep2 = function () {
            if (!$scope.pile.photos.length) {
                $mdToast.show($mdToast.simple().content($translate.instant('views.pile.step1.content')));
                return;
            }
            $state.go('app.pile.step2');
        };

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
