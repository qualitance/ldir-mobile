angular.module('MapModule').controller('MapController',
    ['$scope',
        '$cordovaGeolocation',
        '$stateParams',
        '$ionicModal',
        '$ionicPopup',
        '$mdSidenav',
        '$mdToast',
        'Pile',
        'appConfig',
        'navbarSetup',
        'leafletData',
        'PilePopupDialog',
        '$rootScope',
        '$state',
        'LocationDialog',
        'AuthService',
        'LocalStorageService',
        '$ionicPlatform',
        '$timeout',
        '$cordovaSpinnerDialog',
        'CountyService',
        'leafletBoundsHelpers',
        '$translate',
        'MarkerHelperService',
        function ($scope,
                  $cordovaGeolocation,
                  $stateParams,
                  $ionicModal,
                  $ionicPopup,
                  $mdSidenav,
                  $mdToast,
                  Pile,
                  appConfig,
                  navbarSetup,
                  leafletData,
                  PilePopupDialog,
                  $rootScope,
                  $state,
                  LocationDialog,
                  AuthService,
                  LocalStorageService,
                  $ionicPlatform,
                  $timeout,
                  $cordovaSpinnerDialog,
                  CountyService,
                  leafletBoundsHelpers,
                  $translate,
                  MarkerHelperService) {

            $scope.$on('$ionicView.enter', function (scopes, states) {

                if ($state.current.name !== 'app.map' && $state.current.name !== 'app.map.download') {
                    return;
                }

                if ($scope.initPerformed) {
                    if (states.fromCache) {
                        var locateOnLoad = !!($rootScope.pileLocation);
                        $scope.loadPiles(locateOnLoad);
                        leafletData.getMap().then(function (map) {
                            map.invalidateSize();
                        });
                    }
                    navbarSetup.setBar({}, {});
                }
                else {
                    $scope.init();
                }
            });

            $scope.mapData = {};

            $scope.mapData.markersWatchOptions = {
                doWatch: false,
                isDeep: false,
                individual: {
                    doWatch: false,
                    isDeep: false
                }
            };

            var self = this;
            self.mapTilesUrl = appConfig.mapServerUrl + appConfig.mapboxToken;

            // INIT MAP
            $scope.init = function () {

                navbarSetup.setBar({}, {});
                $scope.initPerformed = true;
                $scope.downloadingMap = false;
                $scope.downloadMode = false;
                $scope.viewTitle = 'Let\'s Do It';
                if ($state.includes('app.map.download')) {
                    $scope.downloadMode = true;
                    $scope.viewTitle = $translate.instant('views.map.saveMapTitle');

                } else {
                    $scope.downloadMode = false;
                    $scope.viewTitle = 'Let\'s Do It';
                }
                // prepare view for download mode
                $scope.$on('$stateChangeSuccess', function () {
                    if ($state.includes('app.map')) {
                        if ($state.params.download) {
                            $scope.downloadMode = true;
                            $scope.viewTitle = $translate.instant('views.map.saveMapTitle');
                            $mdToast.show($mdToast.simple().content($translate.instant('views.map.zoomNotification'))
                                .position('top right'));
                        } else {
                            $scope.downloadMode = false;
                            $scope.viewTitle = 'Let\'s Do It';
                        }
                    }
                });

                $scope.map = {
                    defaults: {
                        tileLayer: self.mapTilesUrl,
                        maxZoom: 18,
                        zoomControl: false,
                        zoomControlPosition: 'bottomleft',
                        attributionControl: false,
                        worldCopyJump: true
                    },
                    markers: {},
                    newMarkers: {},
                    pileIcon: {
                        iconUrl: 'img/pins/red.svg',
                        iconSize: [55, 60],
                        shadowSize: [50, 64],
                        iconAnchor: [25, 56],
                        shadowAnchor: [4, 62],
                        popupAnchor: [2, -50] // point from which the popup should open relative to the iconAnchor
                    },
                    myPositionIcon: {
                        iconUrl: 'img/pins/me_pin.svg',
                        iconSize: [55, 60],
                        shadowSize: [50, 64],
                        iconAnchor: [25, 56],
                        shadowAnchor: [4, 62],
                        popupAnchor: [2, -50] // point from which the popup should open relative to the iconAnchor
                    },
                    events: {
                        map: {
                            enable: [],
                            logic: 'emit'
                        }
                    },
                    center: {
                        zoom: 6,
                        lat: 45.85941212790755,
                        lng: 24.840087890624996
                    },
                    layers: {
                        baselayers: {
                            mapbox_light: {
                                name: 'Me',
                                url: self.mapTilesUrl,
                                type: 'xyz'
                            }
                        },
                        overlays: {
                            Piles: {
                                name: 'Piles',
                                type: 'markercluster',
                                visible: true,
                                'layerOptions': {
                                    'chunkedLoading': true,
                                    'showCoverageOnHover': false,
                                    'removeOutsideVisibleBounds': true
                                }
                            }
                        }
                    }
                };

                if (appConfig.isMobile) {
                    if ($rootScope.platformReady) {
                        $scope.loadPiles(true);
                    } else {
                        $rootScope.platformReadyDefered.promise.then(function () {
                            $scope.loadPiles(true);
                        });
                    }
                } else {
                    $scope.loadPiles(true);
                }
                $scope.$on('leafletDirectiveMarker.click', function (e, args) {
                    if (!$scope.downloadingMap) {
                        PilePopupDialog.show(e, $scope.map.markers[args.modelName]);
                    }
                });

                $scope.$on('ReloadPiles', function () {
                    $scope.loadPiles();
                });

                self.prepareOffline();
            };

            // PREPARE OFFLINE CACHING
            self.prepareOffline = function () {

                leafletData.getMap().then(function (aMap) {

                    var mapquestUrl = self.mapTilesUrl;

                    onReady = function () {
                        var cacheBtn, progressControls;
                        offlineLayer.addTo(aMap);
                        progressControls = new OfflineProgressControl();
                        progressControls.setOfflineLayer(offlineLayer);
                        return aMap.addControl(progressControls);
                    };

                    onError = function (errorType, errorData1, errorData2) {

                        return console.log(errorData2);
                    };

                    options = {
                        maxZoom: 18,
                        onReady: onReady,
                        onError: onError,
                        storeName: 'myOfflineMap',
                        dbOption: 'WebSQL'
                    };

                    offlineLayer = new OfflineLayer(mapquestUrl, options);

                    offlineLayer.on('tilecachingprogressdone', function () {

                        $mdToast.show($mdToast.simple().content($translate.instant('views.map.offlineMap'))
                            .position('top right'));
                        $scope.downloadingMap = false;
                        $state.go('app.map');
                    });
                });
            };

            // Locate after piles are loaded in order to maintain performance on slow devices and keep the processor overhead to functional limit
            $scope.loadPiles = function (locateOnLoad) {

                if (appConfig.isMobile) {
                    $cordovaSpinnerDialog.show($translate.instant('views.map.loadingPiles'));
                }
                if ($scope.map && $scope.map.markers) {
                    Pile.queryMap().$promise.then(function (resp) {
                            if (resp) {
                                $scope.map.newMarkers = {};
                                var allMarkers = false;

                                //if no markers load all, else add new ones
                                if (Object.keys($scope.map.markers).length === 0) {
                                    allMarkers = true;
                                    var temp = [];
                                    angular.forEach(resp, function (pile) {
                                        temp[pile._id] = MarkerHelperService.configPileMarker(pile);
                                    });
                                    $scope.map.markers = temp;
                                    //used $timeout so directive's scope has time to update
                                    $timeout(function () {
                                        $scope.$broadcast('reloadMarkers');
                                        $scope.locate();
                                    }, 100);
                                } else {
                                    var newPiles = [];
                                    for (var j = 0; j < resp.length; j++) {
                                        if (!$scope.map.markers.hasOwnProperty(resp[j]._id) ||
                                            ($scope.map.markers.hasOwnProperty(resp[j]._id) &&
                                            $scope.map.markers[resp[j]._id].status !== resp[j].status)) {
                                            newPiles.push(resp[j]);
                                        }
                                    }
                                    var newTemp = [];
                                    angular.forEach(newPiles, function (pile) {
                                        newTemp[pile._id] = MarkerHelperService.configPileMarker(pile);
                                    });
                                    $scope.map.newMarkers = newTemp;
                                    if (Object.keys($scope.map.newMarkers).length > 0) {
                                        //used $timeout so directive's scope has time to update
                                        $timeout(function () {
                                            $scope.$broadcast('reloadMarkers');
                                        }, 100);
                                    }
                                }
                                if (appConfig.isMobile) {
                                    if (allMarkers) {
                                        $timeout(function () {
                                            $cordovaSpinnerDialog.hide();
                                        }, 1000);
                                    } else {
                                        $cordovaSpinnerDialog.hide();
                                    }
                                }
                                if (locateOnLoad) {
                                    $scope.locate();
                                }

                            } else {
                                $mdToast.show($mdToast.simple().content($translate.instant('errors.standard')));
                                if (locateOnLoad) {
                                    $scope.locate();
                                }
                            }
                        },
                        function (error) {
                            if (appConfig.isMobile) {
                                $cordovaSpinnerDialog.hide();
                            }

                            $mdToast.show($mdToast.simple().content(error.isAuthError ?
                                $translate.instant('views.map.sessionExpired') :
                                $translate.instant('views.map.checkConnection')));

                            if (!error.isAuthError) {
                                if (LocalStorageService.getObject('offlineCoordinates')) {
                                    $scope.goToCoords(LocalStorageService.getObject('offlineCoordinates'));
                                } else {
                                    $scope.locate();
                                }
                            }
                        });
                }
            };

            /**
             * Center map on user's current position
             */
            $scope.locate = function () {
                // LOCATE ONLY WHEN NO COORDS ARE SPECIFIED
                if (!$rootScope.pileLocation) {
                    if ($rootScope.platformReady) {
                        prepareLocation();
                    } else {
                        $rootScope.platformReadyDefered.promise.then(function () {
                            prepareLocation();
                        });
                    }
                } else {
                    $scope.goToCoords($rootScope.pileLocation);
                }
            };

            function prepareLocation() {
                var posOptions = {timeout: 10000, enableHighAccuracy: false};
                if (!appConfig.isIos) {
                    cordova.require('com.neton.cordova.diagnostic.diagnostic').isGpsEnabled(function (available) {
                        if (!available.success) {
                            LocationDialog.show().then(function () {
                                $scope.gettingPosition = true;
                                getLocation(posOptions);
                            }, function () {
                                $mdToast.show($mdToast.simple().content($translate.instant('views.map.location')));
                            });
                        } else {
                            $scope.gettingPosition = true;
                            getLocation(posOptions);
                        }
                    });
                } else {
                    getLocation(posOptions);
                }
            }

            function getLocation(posOptions) {
                $cordovaGeolocation.getCurrentPosition(posOptions).then(function (position) {
                    $scope.gettingPosition = false;
                    $scope.map.center.lat = position.coords.latitude;
                    $scope.map.center.lng = position.coords.longitude;
                    $scope.map.center.zoom = 15;

                }, function () {
                    $scope.gettingPosition = false;
                    if (!appConfig.isIos) {
                        cordova.require('com.neton.cordova.diagnostic.diagnostic').isGpsEnabled(function (available) {
                            if (!available.success) {
                                $mdToast.show($mdToast.simple().content($translate.instant('views.map.location')));
                            } else {
                                $mdToast.show($mdToast.simple().content($translate.instant('views.map.locationError')));
                            }
                        });
                    } else {
                        $mdToast.show($mdToast.simple().content($translate.instant('views.map.location')));
                    }
                });
            }

            /**
             * Center map on user's current position
             */
            $scope.goToCoords = function (coords) {
                $scope.map.center.lat = coords.lat;
                $scope.map.center.lng = coords.lng;
                $scope.map.center.zoom = 15;
                $rootScope.pileLocation = null;
            };

            $scope.checkRedirects = function () {
                var token = LocalStorageService.get('token');
                if (token === undefined || token == null) {
                    $state.go('auth');
                    return true;
                }
                else {
                    $rootScope.token = token;

                    if (!AuthService.hasProfileComplete()) {
                        $state.go('app.profile');
                        $mdToast.show($mdToast.simple().content($translate.instant('views.map.completeProfile')));
                        return true;
                    }
                    return false;
                }
            };

            $scope.reportPile = function () {

                var countyLayer = CountyService.getCounties();
                var gjLayer = L.geoJson(countyLayer[0]);
                var pipArray = leafletPip.pointInLayer([$scope.map.center.lng, $scope.map.center.lat], gjLayer, true);

                if (pipArray.length > 0) {
                    $state.go('app.pile', {location: {lat: $scope.map.center.lat, lng: $scope.map.center.lng}});
                } else {
                    $mdToast.show($mdToast.simple().content($translate.instant('views.map.boundariesNotification')));
                }
            };

            // OFFLINE MAP FUNCTIONALITY
            $scope.downloadOffline = function () {
                // CLEAR PREVIOUS SAVED TILES BEFORE STORING NEW ONES
                LocalStorageService.setObject('offlineCoordinates', $scope.map.center);
                offlineLayer.clearTiles(function () {

                    var nbTiles;
                    nbTiles = offlineLayer.calculateNbTiles();
                    if (nbTiles === -1) {
                        $mdToast.show($mdToast.simple().content($translate.instant('views.map.zoomLevel')));
                        return;
                    }
                    if (nbTiles < 10000) {
                        $scope.downloadingMap = true;
                        $mdToast.show($mdToast.simple().content($translate.instant('views.map.offlineMapCached'))
                            .position('top right'));
                        return offlineLayer.saveTiles(18, (function () {
                            return function () {
                                return null;
                            };
                        })(this), (function () {
                            return function () {
                            };
                        })(this), (function () {
                            return function (error) {
                                $mdToast.show($mdToast.simple().content(error).position('top right'));
                                $scope.downloadingMap = false;
                            };
                        })(this));
                    } else {
                        $mdToast.show($mdToast.simple().content($translate.instant('views.map.tiles1') + nbTiles +
                            $translate.instant('views.map.tiles2'))
                            .position('top right'));
                    }
                });
            };
        }]);
