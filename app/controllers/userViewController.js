angular
  .module("myApp")
  .controller(
    "UserViewController",
    function (
      $scope,
      $rootScope,
      UserService,
      ngDialog,
      userId,
      $location,
      $timeout
    ) {
      $scope.isNewUser = false;
      $scope.user = {};
      $scope.userTypes = ["Admin", "Driver"];
      $scope.repeatedPassword;
      $scope.userViewTitle = "Create new user";
      $scope.userSaveButtonTitle = "Create";

      UserService.getUserById(userId).then(function (currentUser) {
        $scope.user = currentUser;
        $scope.updateViewFields(currentUser);
        $scope.$apply();
      });

      $scope.updateViewFields = function (user) {
        $scope.isNewUser = user ? false : true;
        $scope.userViewTitle = user
          ? `${$scope.user.first_name} ${$scope.user.last_name}`
          : "Create new user";
        $scope.userSaveButtonTitle = user ? "Save" : "Create";
        $scope.repeatedPassword = user ? $scope.user.password : "";
      };

      $scope.saveUser = function (user) {
        $scope.errors = {};
        $scope.isFormValid = true;

        if ($scope.isNewUser) {
          $scope.createUser(user);
        } else {
          $scope.updateUser(user);
        }
      };

      $scope.createUser = function (user) {
        UserService.createUser(user)
          .then(function (success) {
            ngDialog.close();
            $rootScope.$broadcast("tableUpdated");
            $rootScope.$broadcast("updateSuccessfullyMessage", {
              successfullyMessage: success.message,
            });
          })
          .catch(function (error) {
            console.log(error);
            ngDialog.close();
            $timeout(function () {
              $location
                .path("/error")
                .search({ error: error.message, status: error.status });
            });
          });
      };

      $scope.updateUser = function (user) {
        UserService.updateUser(user)
          .then(function (success) {
            ngDialog.close();
            $rootScope.$broadcast("tableUpdated");
            $rootScope.$broadcast("updateSuccessfullyMessage", {
              successfullyMessage: success.message,
            });
          })
          .catch(function (error) {
            ngDialog.close();
            console.log(error);
            $timeout(function () {
              $location
                .path("/error")
                .search({ error: error.message, status: error.status });
            });
          });
      };

      $scope.deleteUser = function (id) {
        UserService.deleteUser(id).then(function (success) {
          ngDialog.close();
          $rootScope.$broadcast("tableUpdated");
          $rootScope.$broadcast("updateSuccessfullyMessage", {
            successfullyMessage: success.message,
          });
        });
      };

      $scope.closeDialog = function () {
        ngDialog.close();
      };
    }
  );
