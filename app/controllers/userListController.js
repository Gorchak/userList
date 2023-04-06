angular.module('myApp')
.controller('UserListController', ['$scope', 'ngDialog', 'UserService', '$location', '$timeout', function($scope, ngDialog, UserService, $location, $timeout) {
  
  $scope.isDisplaySuccessfullyMessage = false;
  $scope.successfullyMessageValue;

  $scope.getUsersAndUpdateList = function() {
    UserService.getUsers().then(function(data) {
      $scope.$apply(function () {
        $scope.userList = data;
      });
    });
  }

  $scope.getUsersAndUpdateList();

  $scope.$on('tableUpdated', function() {
    $scope.getUsersAndUpdateList()
  });

  $scope.$on('updateSuccessfullyMessage', function(event, args) {
    $scope.successfullyMessageValue = args.successfullyMessage
    $scope.displaySuccessfullyMessage();
  });
  
  $scope.displaySuccessfullyMessage = function() {
    $scope.isSuccessfullyMessage = true;
    $timeout(function() {
      $scope.isSuccessfullyMessage = false;
    }, 3000);
  }

  $scope.goToUserView = function() {
    $location.path('/users/' + userId);
  };

  $scope.openUserFormDialog = function(userId) {
    ngDialog.open({
      template: 'app/views/user-view.html',
      className: 'ngdialog-theme-default',
      controller: 'UserViewController',
      resolve: {
        userId: function() {
          return userId;
        }
      }
    });
  };
}]);