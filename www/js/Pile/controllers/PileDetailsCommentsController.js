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

        $scope.goToDetails = function () {
            $state.go('app.pileDetail.details', {id: $scope.pileId});
        };

        $scope.goBack = function () {
            if ($rootScope.previousState && $rootScope.previousState.name) {
                $state.go($rootScope.previousState.name);
            }
            else {
                $state.go('app.map');
            }
        };
    }]);
