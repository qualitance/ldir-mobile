/**
 * Created by cristian on 27/4/2015.
 */

angular.module('PileModule')
    .directive('reportProgress', ['$state', function ($state) {
        return {
            restrict: 'E',
            scope: {step: '@', clickable: '='},
            templateUrl: 'js/Pile/templates/reportProgress.html',
            link: function (scope) {
                scope.goTo = function (state) {
                    if (scope.clickable) {
                        $state.go(state);
                    }
                };
            }
        };
    }])

    .directive('pileSizeCard', function () {
        return {
            restrict: 'E',
            scope: {size: '=', title: '@', editable: '@'},
            templateUrl: 'js/Pile/templates/pileSizeCard.html',
            link: function (scope) {
                scope.setSize = function (selectedSize) {
                    if (!scope.editable) {
                        return;
                    }
                    scope.size = selectedSize;
                };
            }
        };
    })

    .directive('pileSize', function () {
        return {
            restrict: 'E',
            scope: {size: '=', title: '@', editable: '='},
            templateUrl: 'js/Pile/templates/pileSize.html',
            link: function (scope) {
                scope.setSize = function (selectedSize) {
                    if (!scope.editable) {
                        return;
                    }
                    scope.size = selectedSize;
                };
            }
        };
    })

    .directive('pileContents', function () {
        return {
            restrict: 'E',
            scope: {contents: '='},
            templateUrl: 'js/Pile/templates/pileContents.html',
            link: function (scope, element, attrs) {
            }
        };
    })

    .directive('pileAreas', function () {
        return {
            restrict: 'E',
            scope: {areas: '='},
            templateUrl: 'js/Pile/templates/pileAreas.html',
            link: function (scope) {

                scope.updateAreaList = function (flag, area) {
                    if (flag) {
                        scope.areas.push(area);
                    } else {
                        var index = scope.areas.indexOf(area);
                        scope.areas.splice(index, 1);
                    }
                };
            }
        };
    })

    .directive('pilePhoto', function ($timeout) {
        return {
            restrict: 'E',
            scope: {photo: '=', removePhoto: '&', hasControls: '@'},
            templateUrl: 'js/Pile/templates/pilePhoto.html',
            link: function (scope) {

                scope.getBackground = function (url) {

                    return {
                        'background-image': 'url(' + url + ')'
                    };
                };
                $timeout(function () {
                    scope.test = true;
                }, 200);

            }
        };
    })

    .directive('helpStep', function () {
        return {
            restrict: 'E',
            scope: {
                step: '@',
                language: '@'
            },
            template: '<div style="{{url}}background-size: auto 90%;  margin-top: -16px;" class="height100"></div>',
            controller: function ($scope) {
                $scope.url = 'background: #fff url(\'img/walkthrough/step' + $scope.step + '_' + $scope.language +
                    '.jpg\') no-repeat center center;';
            }
        };
    });
