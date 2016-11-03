angular.module('PileModule', [])
    .config(function ($stateProvider) {

        $stateProvider
            .state('app.pile', {
                url: '/pile',
                views: {
                    'main': {
                        templateUrl: 'js/Pile/templates/reportBase.html',
                        controller: 'PileController'
                    }
                },
                params: {
                    location: null
                }
            })
            .state('app.pile.step1', {
                url: '/step1',
                templateUrl: 'js/Pile/templates/step1.html',
                controller: 'Step1Controller'
            })
            .state('app.pile.step2', {
                url: '/step2',
                templateUrl: 'js/Pile/templates/step2.html',
                controller: 'Step2Controller'
            })
            .state('app.pile.step3', {
                url: '/step3',
                templateUrl: 'js/Pile/templates/step3.html',
                controller: 'Step3Controller'
            })
            .state('app.pile.step4', {
                url: '/step4',
                templateUrl: 'js/Pile/templates/step4.html',
                controller: 'Step4Controller'
            })
            .state('app.pileDetail', {
                url: '/pileDetail',
                views: {
                    'main': {
                        template: '<ion-nav-view></ion-nav-view>'
                    }
                },
                abstract: true
            })
            .state('app.pileDetail.details', {
                url: '/:id',
                templateUrl: 'js/Pile/templates/details.html',
                controller: 'PileDetailsController'
            })
            .state('app.pileDetail.comments', {
                url: '/:id/comments',
                templateUrl: 'js/Pile/templates/pileDetailsComments.html',
                controller: 'PileDetailsCommentsController'
            });
    })
    .run(function ($state, $rootScope) {
        $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams) {
            if (toState.name === 'app.pile' && toParams.location) {
                $state.go('app.pile.step1');
            }
        });
    });
