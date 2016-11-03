angular.module('ServicesModule')
    .service('PilePopupDialog', ['appConfig', '$mdDialog',
        function (appConfig, $mdDialog) {

            return {
                show: function (ev, pile) {
                    $mdDialog.show({
                        controller: PilePopupDialogController,
                        templateUrl: 'js/services/dialogs/templates/PilePopupDialogContent.html',
                        targetEvent: ev,
                        resolve: {
                            pile: function () {
                                return pile;
                            }
                        }
                    });
                }
            };

            function PilePopupDialogController($scope, $mdDialog, pile, $state, Pile) {

                $scope.pile = pile || {};
                if (pile.id) {
                    Pile.details({id: pile.id}).$promise.then(function (response) {
                        $scope.pile.content = response.content;
                    });
                }

                $scope.cancel = function () {
                    $mdDialog.cancel();
                };

                $scope.goToDetails = function () {
                    $mdDialog.cancel();
                    $state.go('app.pileDetail.details', {id: pile.id});
                };
            }
        }]);
