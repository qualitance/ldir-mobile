angular.module('ServicesModule')
    /**
     * @ngdoc service
     * @service
     * @name PilePopupDialog
     * @description pile popup dialog service
     * @requires appConfig
     * @requires $mdDialog
     */
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

            /**
             * @ngdoc controller
             * @name PilePopupDialogController
             * @description pile popup dialog controller
             * @property {Object} pile - current pile
             * @requires $scope
             * @requires $mdDialog
             */
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

                /**
                 * @ngdoc
                 * @name PilePopupDialogController#goToDetails
                 * @methodOf PilePopupDialogController
                 * @example
                 * <pre><button ng-click="goToDetails()">...</button></pre>
                 * @description
                 * redirects to pile details view
                 */
                $scope.goToDetails = function () {
                    $mdDialog.cancel();
                    $state.go('app.pileDetail.details', {id: pile.id});
                };
            }
        }]);
