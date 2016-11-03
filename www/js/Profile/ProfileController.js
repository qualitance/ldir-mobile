/**
 * Created by cristian on 07.05.2015.
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

            $scope.changeCountry = function (country) {
                CountyService.getCountiesFromServer(country._id).$promise.then(function (response) {
                    $scope.currentUser.county = undefined;
                    $scope.counties = response;
                }, function () {
                    $mdToast.show($mdToast.simple().content($translate.instant('errors.standard')));
                });
            };

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

            $scope.togglePassForm = function () {
                $scope.viewPassForm = !$scope.viewPassForm;
                $ionicScrollDelegate.resize();
                $ionicScrollDelegate.scrollBottom();
            };

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

            $scope.goBack = function () {
                $scope.getUser();
                $ionicViewSwitcher.nextDirection('back');
                $state.go('app.map');
            };
        }]);
