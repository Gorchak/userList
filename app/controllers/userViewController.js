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
      $timeout,
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

        //Validate required fields
        if (!user.username) {
          $scope.errors.username = "Username is required";
          isFormValid = false;
        }
        if (!user.first_name) {
          $scope.errors.first_name = "First name is required";
          isFormValid = false;
        }
        if (!user.last_name) {
          $scope.errors.last_name = "Last name is required";
          isFormValid = false;
        }
        if (!user.email) {
          $scope.errors.email = "Email is required";
          isFormValid = false;
        }
        if (!user.password) {
          $scope.errors.password = "Password is required";
          isFormValid = false;
        }
        if (!user.user_type) {
          $scope.errors.user_type = "User type is required";
          isFormValid = false;
        }

        //Validate email format
        if (user.email && !validateEmail(user.email)) {
          $scope.errors.email = "Invalid email format";
          isFormValid = false;
        }

        //Validate password format
        if (user.password && !validatePassword(user.password)) {
          $scope.errors.password =
            "Password must be at least 8 characters and contain at least one letter and one number";
            isFormValid = false;
        }

        if (isFormValid) {
          if ($scope.isNewUser) {
            UserService.createUser(user)
              .then(function (success) {
                ngDialog.close();
                $rootScope.$broadcast("tableUpdated");
                $rootScope.$broadcast('updateSuccessfullyMessage', { successfullyMessage: success.message });
              })
              .catch(function (error) {
                console.log(error);
                $scope.errors.server = error;
                ngDialog.close();
                $timeout(function () {
                  $location.path('/error').search({error: error.message, status: error.status});
                });
              });
          } else {
            UserService.updateUser(user)
              .then(function (success) {
                ngDialog.close();
                $rootScope.$broadcast("tableUpdated");
                $rootScope.$broadcast('updateSuccessfullyMessage', { successfullyMessage: success.message });
              })
              .catch(function (error) {
                ngDialog.close();
                console.log(error);
                $scope.errors.server =
                  "Server error occurred while saving the user";
              });
          }
        }
      };

      $scope.deleteUser = function (id) {
        UserService.deleteUser(id).then(function () {
          $rootScope.$broadcast("tableUpdated");
          ngDialog.close();
        });
      };

      function validateEmail(email) {
        var emailPattern = /^\S+@\S+\.\S+$/;
        return emailPattern.test(email);
      }

      function validatePassword(password) {
        var passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
        return passwordPattern.test(password);
      }

      $scope.closeDialog = function () {
        ngDialog.close();
      };
    }
  );
