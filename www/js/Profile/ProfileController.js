/**
 * @ngdoc controller
 * @name ProfileController
 * @description profile view controller
 * @property {Object} profileData - pile object
 * @property {Object} passData - pile object
 * @property {Boolean} viewPassForm - pile object
 * @property {Object} phoneRegex - pile object
 * @requires $scope
 * @requires $state
 * @requires $rootScope
 * @requires navbarSetup
 * @requires User
 * @requires $mdToast
 * @requires $ionicScrollDelegate
 * @requires AuthService
 * @requires $ionicViewSwitcher
 * @requires $translate
 * @requires CountryService
 * @requires CountyService
 */
angular.module('ProfileModule')
    .controller('ProfileController', ['$scope', '$state', '$rootScope', 'navbarSetup', 'User', '$mdToast',
        '$ionicScrollDelegate', 'AuthService', '$ionicViewSwitcher', '$translate', 'CountryService', 'CountyService',
        function ($scope, $state, $rootScope, navbarSetup, User, $mdToast,
                  $ionicScrollDelegate, AuthService, $ionicViewSwitcher, $translate, CountryService, CountyService) {

            $scope.$on('$ionicView.beforeEnter', function () {
                $scope.init();
            });

            $scope.init = function () {
                $scope.profileData = {};
                $scope.passData = {};
                $scope.viewPassForm = false;
                $scope.phoneRegex = /^\d+$/;

                $scope.getCurrentUser();
            };

            /**
             * @ngdoc
             * @name ProfileController#getCurrentUser
             * @methodOf ProfileController
             * @description
             * gets current user and also country and county
             */
            $scope.getCurrentUser = function () {
                $rootScope.me = AuthService.getCurrentUser();
                $scope.currentUser = angular.copy($rootScope.me);
                CountryService.getCountries().then(function (response) {
                    $scope.countries = response;
                    $scope.country = $scope.currentUser.county ? angular.copy($scope.currentUser.county.country) :
                        response[0];
                    CountyService.getCountiesFromServer($scope.country._id).$promise.then(function (response) {
                        $scope.counties = response;
                        if (!$scope.currentUser.county) {
                            $scope.currentUser.county = undefined;
                        }
                    });
                }, function () {
                    $mdToast.show($mdToast.simple().content($translate.instant('errors.standard')));
                });
            };

            /**
             * @ngdoc
             * @name ProfileController#changeCountry
             * @methodOf ProfileController
             * @param {Object} country - selected country object
             * @example
             * <pre><md-select name="country" ng-model="country" required ng-change="changeCountry(country)">...</md-select></pre>
             * @description
             * gets counties on country change
             */
            $scope.changeCountry = function (country) {
                CountyService.getCountiesFromServer(country._id).$promise.then(function (response) {
                    $scope.currentUser.county = undefined;
                    $scope.counties = response;
                }, function () {
                    $mdToast.show($mdToast.simple().content($translate.instant('errors.standard')));
                });
            };

            /**
             * @ngdoc
             * @name ProfileController#save
             * @methodOf ProfileController
             * @example
             * <pre><button ng-click="save()">...</button></pre>
             * @description
             * gets counties on country change
             */
            $scope.save = function () {
                var form = document.getElementsByName('profileForm')[0];
                var formScope = angular.element(form).scope();

                if (formScope.profileForm.$valid) {
                    User.save($scope.currentUser).$promise.then(
                        function () {
                            $mdToast.show($mdToast.simple().content($translate.instant('view.profile.success')));
                            var user = angular.copy($scope.currentUser);
                            AuthService.setCurrentUser(user);
                            $scope.goBack();
                        },
                        function () {
                            $mdToast.show($mdToast.simple().content($translate.instant('errors.standard')));
                        });
                }
            };

            /**
             * @ngdoc
             * @name ProfileController#togglePassForm
             * @methodOf ProfileController
             * @example
             * <pre><md-button ng-click="togglePassForm()"</md-button></pre>
             * @description
             * toggle password form
             */
            $scope.togglePassForm = function () {
                $scope.viewPassForm = !$scope.viewPassForm;
                $ionicScrollDelegate.resize();
                $ionicScrollDelegate.scrollBottom();
            };

            /**
             * @ngdoc
             * @name ProfileController#checkPasswordsMatch
             * @methodOf ProfileController
             * @param {Object} form - change password form
             * @example
             * <pre><input required type="password" name="repass" ng-model="passData.repass" ng-change="checkPasswordsMatch(passForm)"></pre>
             * @description
             * check if entered passwords match
             */
            $scope.checkPasswordsMatch = function (form) {
                if ($scope.passData.newPass === $scope.passData.oldPass) {
                    form.repass.$setValidity('samePass', false);
                }
                else {
                    if ($scope.passData.newPass !== $scope.passData.repass) {
                        form.repass.$setValidity('noMatch', false);
                    }
                    else {
                        form.repass.$setValidity('noMatch', true);
                    }
                }
            };

            /**
             * @ngdoc
             * @name ProfileController#changePassword
             * @methodOf ProfileController
             * @param {Object} form - change password form
             * @example
             * <pre><md-button aria-label="Register" ng-click="changePassword(passForm)">Change Password</md-button></pre>
             * @description
             * changes old password for current user
             */
            $scope.changePassword = function (form) {
                form.$setSubmitted();
                if (form.$valid) {
                    User.changePassword({
                        oldPassword: $scope.passData.oldPass,
                        newPassword: $scope.passData.newPass
                    }).$promise.then(function () {
                        $mdToast.show($mdToast.simple().content($translate.instant('view.profile.passwordChangeSuccess')));
                        $scope.togglePassForm();
                        $scope.passData = {};
                    }, function () {
                        $mdToast.show($mdToast.simple().content($translate.instant('errors.standard')));
                    });
                }
            };

            /**
             * @ngdoc
             * @name ProfileController#setPassword
             * @methodOf ProfileController
             * @param {Object} form - change password form
             * @example
             * <pre><md-button aria-label="Register" ng-click="setPassword(passForm)">Set Password</md-button></pre>
             * @description
             * sets new password if user has none
             */
            $scope.setPassword = function (form) {
                form.$setSubmitted();
                User.changePassword({
                    newPassword: $scope.passData.pass
                }).$promise.then(function () {
                    $mdToast.show($mdToast.simple().content($translate.instant('view.profile.passwordSetSuccess')));
                    $scope.togglePassForm();
                    $scope.passData = {};
                    $scope.currentUser.pass = true;
                    $rootScope.me.pass = true;
                }, function () {
                    $mdToast.show($mdToast.simple().content($translate.instant('errors.standard')));
                });
            };

            /**
             * @ngdoc
             * @name ProfileController#goBack
             * @methodOf ProfileController
             * @example
             * <pre><button ng-click="goBack()">...</button></pre>
             * @description
             * redirects to map view
             */
            $scope.goBack = function () {
                $scope.getUser();
                $ionicViewSwitcher.nextDirection('back');
                $state.go('app.map');
            };
        }]);
