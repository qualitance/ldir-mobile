/**
 * @ngdoc controller
 * @name ReportIssueController
 * @description report issue page controller
 * @property {Object} issue - issue to report object
 * @requires $scope
 * @requires $state
 * @requires $rootScope
 * @requires navbarSetup
 * @requires $ionicHistory
 * @requires $mdToast
 * @requires Issue
 * @requires appConfig
 * @requires $cordovaSpinnerDialog
 * @requires $ionicViewSwitcher
 * @requires $translate
 */
angular.module('HelpModule').controller('ReportIssueController', ['$scope', '$state', '$rootScope', 'navbarSetup',
    '$ionicHistory', '$mdToast', 'Issue', 'appConfig', '$cordovaSpinnerDialog', '$ionicViewSwitcher', '$translate',
    function ($scope, $state, $rootScope, navbarSetup,
              $ionicHistory, $mdToast, Issue, appConfig, $cordovaSpinnerDialog, $ionicViewSwitcher, $translate) {

        $scope.$on('$ionicView.beforeEnter', function () {
            $scope.init();
        });

        $scope.init = function () {
            $scope.issue = {};
        };

        /**
         * @ngdoc
         * @name ReportIssueController#report
         * @methodOf ReportIssueController
         * @example
         * <pre><form name="reportIssueForm" id="reportIssueForm" ng-submit="reportIssueForm.$valid && report()"></pre>
         * @description
         * sends report issue
         */
        $scope.report = function () {
            var formScope = angular.element(document.querySelector('#reportIssueForm')).scope();
            var form = formScope.reportIssueForm;
            form.$setSubmitted();
            if (form.$valid) {
                if (appConfig.isMobile) {
                    $cordovaSpinnerDialog.show($translate.instant('views.reportIssue.reporting'));
                }
                Issue.create(formScope.issue).$promise.then(function success() {
                        if (appConfig.isMobile) {
                            $cordovaSpinnerDialog.hide();
                        }
                        // RESET FORM
                        form.$setPristine();
                        form.$setUntouched();
                        form.$submitted = false;
                        $mdToast.show($mdToast.simple().content($translate.instant('views.reportIssue.reported')));
                        $scope.goBack();
                    },
                    function () {
                        if (appConfig.isMobile) {
                            $cordovaSpinnerDialog.hide();
                        }
                        $mdToast.show($mdToast.simple().content($translate.instant('errors.standard')));
                    });
            }
        };

        /**
         * @ngdoc
         * @name ReportIssueController#goBack
         * @methodOf ReportIssueController
         * @example
         * <pre><button ng-click="goBack()">...</button></pre>
         * @description
         * redirects to previous state or map
         */
        $scope.goBack = function () {
            $ionicViewSwitcher.nextDirection('back');
            if ($rootScope.previousState && $rootScope.previousState.name) {
                $state.go($rootScope.previousState.name);
            }
            else {
                $state.go('app.map');
            }
        };
    }]);
