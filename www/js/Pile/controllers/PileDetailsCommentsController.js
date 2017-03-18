/**
 * @ngdoc controller
 * @name PileDetailsCommentsController
 * @description pile comments controller
 * @property {String} pileId - pile object
 * @property {Object} data - comment object
 * @property {Integer} maxPhotoCount - maximum number of photos to show
 * @requires $scope
 * @requires $rootScope
 * @requires navbarSetup
 * @requires $state
 * @requires CommentsService
 * @requires $mdToast
 * @requires appConfig
 * @requires $translate
 */
angular.module('PileModule').controller('PileDetailsCommentsController', ['$scope', '$rootScope', 'navbarSetup',
    '$state', 'CommentsService', '$mdToast', 'appConfig', '$translate',
    function ($scope, $rootScope, navbarSetup, $state, CommentsService, $mdToast, appConfig, $translate) {

        $scope.pileId = $state.params.id;
        $scope.data = {};

        $scope.addComment = function () {

            var formScope = angular.element(document.querySelector('#commentForm')).scope();
            var form = formScope.commentForm;

            form.$setSubmitted();

            if (form.$valid) {

                CommentsService.create({pile: $scope.pileId}, {
                    description: $scope.data.addedComment
                }).$promise.then(function (result) {
                        if (result) {
                            $scope.goToDetails();
                        } else {
                            $mdToast.show($mdToast.simple().content($translate.instant('errors.standard')));
                        }
                    },
                    function error() {
                        $mdToast.show($mdToast.simple().content($translate.instant('errors.standard')));
                    });
            }
        };

        /**
         * @ngdoc
         * @name PileDetailsCommentsController#goToDetails
         * @methodOf PileDetailsCommentsController
         * @example
         * <pre><button ng-click="goToDetail()">...</button></pre>
         * @description
         * redirects to pile details view
         */
        $scope.goToDetails = function () {
            $state.go('app.pileDetail.details', {id: $scope.pileId});
        };

        /**
         * @ngdoc
         * @name PileDetailsCommentsController#goBack
         * @methodOf PileDetailsCommentsController
         * @example
         * <pre><button ng-click="goBack()">...</button></pre>
         * @description
         * redirects to previous state or map
         */
        $scope.goBack = function () {
            if ($rootScope.previousState && $rootScope.previousState.name) {
                $state.go($rootScope.previousState.name);
            }
            else {
                $state.go('app.map');
            }
        };
    }]);
