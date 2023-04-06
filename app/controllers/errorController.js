angular.module("myApp").controller("ErrorController", function ($scope, $location, $routeParams, $window) {
  $scope.message = $routeParams.error;
  $scope.status = $routeParams.status;

  if (!$scope.error && !$scope.status) {
    $scope.goToHomePage();
  }
  
  $scope.goToHomePage = function() {
    $location.url('/');
  }
});
