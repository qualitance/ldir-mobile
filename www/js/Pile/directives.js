angular.module('PileModule')
    /**
     * @ngdoc directive
     * @name reportProgress
     * @description report progress in pile details view, clickable after user reaches last step
     * @example
     * <pre><report-progress step="{{pile.progressStep}}" clickable="pile.hasReachedLastStep"></report-progress></pre>
     */
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

    /**
     * @ngdoc directive
     * @name pileSizeCard
     * @description pile size card directive, editable if reporting is in step4
     * @example
     * <pre><pile-size-card size="pile.size" title="Size" editable="1"></pile-size-card></pre>
     */
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

    /**
     * @ngdoc directive
     * @name pileSize
     * @description pile size directive
     * @example
     * <pre><pile-size class="popup-size" editable="false" size="pile.size"></pile-size></pre>
     */
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

    /**
     * @ngdoc directive
     * @name pileContents
     * @description pile contents select directive
     * @example
     * <pre><pile-contents contents="pile.contents"></pile-contents></pre>
     */
    .directive('pileContents', function () {
        return {
            restrict: 'E',
            scope: {contents: '='},
            templateUrl: 'js/Pile/templates/pileContents.html',
            link: function (scope, element, attrs) {
            }
        };
    })

    /**
     * @ngdoc directive
     * @name pileAreas
     * @description pile contents select directive
     * @example
     * <pre><pile-areas areas="pile.areas"></pile-areas></pre>
     */
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

    /**
     * @ngdoc directive
     * @name pilePhoto
     * @description pile single photo directive
     * @example
     * <pre><pile-photo photo="photo" ng-click="zoomImage(photo.displaySrc)" remove-photo="removePhoto($index)" has-controls="true"></pile-photo></pre>
     */
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

    /**
     * @ngdoc directive
     * @name helpStep
     * @description help steps images directive
     * @example
     * <pre><help-step step="{{i}}" language="{{language}}"></help-step></pre>
     */
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
