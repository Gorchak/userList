angular.module("myApp").directive("formValidation", function ($timeout) {
  return {
    restrict: "A",
    scope: {
      errors: "=",
      isFormValid: "=",
      userForm: "="
    },
    link: function (scope, element, attrs) {
      let form = element[0];
      form.addEventListener("input", function (event) {
        $timeout(function() {
          scope.errors = {};
          scope.isFormValid = true;
  
          //Validate required fields
          if (!scope.userForm.username.$viewValue) {
            scope.errors.username = "Username is required";
            scope.isFormValid = false;
          }
          if (!scope.userForm.firstName.$viewValue) {
            scope.errors.firstName = "First name is required";
            scope.isFormValid = false;
          }
          if (!scope.userForm.lastName.$viewValue) {
            scope.errors.lastName = "Last name is required";
            scope.isFormValid = false;
          }
          if (!scope.userForm.email.$viewValue) {
            scope.errors.email = "Email is required";
            scope.isFormValid = false;
          }
          if (!scope.userForm.password.$viewValue) {
            scope.errors.password = "Password is required";
            scope.isFormValid = false;
          }
          if (!scope.userForm.repeatPassword.$viewValue) {
            scope.errors.repeatPassword = "Repeat password is required";
            scope.isFormValid = false;
          }
          
          if (!scope.userForm.userType.$viewValue) {
            scope.errors.userType = "User type is required";
            scope.isFormValid = false;
          }
          //Validate email format
          if (
            scope.userForm.email.$viewValue &&
            !validateEmail(scope.userForm.email.$viewValue)
          ) {
            scope.errors.email = "Invalid email format";
            scope.isFormValid = false;
          }
          if (
            scope.userForm.repeatPassword.$viewValue &&
            !validateRepeatedPassword(
              scope.userForm.password.$viewValue,
              scope.userForm.repeatPassword.$viewValue
            )
          ) {
            scope.errors.repeatPassword = "Passwords must match";
            scope.isFormValid = false;
          }
  
          //Validate password format
          if (
            scope.userForm.password.$viewValue &&
            !validatePassword(scope.userForm.password.$viewValue)
          ) {
            scope.errors.password =
              "Password must be at least 8 characters and contain at least one letter and one number";
            scope.isFormValid = false;
          }
  
          function validateEmail(email) {
            let emailPattern = /^\S+@\S+\.\S+$/;
            return emailPattern.test(email);
          }
  
          function validatePassword(password) {
            let passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
            return passwordPattern.test(password);
          }
  
          function validateRepeatedPassword(password, repeatPassword) {
            return password == repeatPassword;
          }
        })
      });
    },
  };
});
