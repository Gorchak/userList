angular.module("myApp").directive('formValidation', function() {
  return {
    restrict: 'A',
    require: '^form',
    link: function(scope, element, attrs, formCtrl) {
      // var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      // formCtrl.email.$validators.email = function(modelValue, viewValue) {
      //   var test = emailRegex.test(viewValue);
      //   debugger;
      //   return emailRegex.test(viewValue);
      // };

      var usernameRegex = /^[a-zA-Z0-9]+$/;
      var passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
      // var emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
      var emailRegex = /^[a-zA-Z0-9]+$/;
      var userTypeRegex = /^(Admin|Driver)$/;
      
      var validateUsername = function(value) {
        if (!value) {
          formCtrl.username.$setValidity('required', false);
        } else if (!usernameRegex.test(value)) {
          formCtrl.username.$setValidity('username', false);
        }
        // } else {
        //   scope.getExistingUsernames(value).then(function(response) {
        //     if (response.data.usernameExists) {
        //       formCtrl.username.$setValidity('username', false);
        //     } else {
        //       formCtrl.username.$setValidity('username', true);
        //     }
        //   });
        // }
      };
      
      var validateFirstName = function(value) {
        if (!value) {
          formCtrl.first_name.$setValidity('required', false);
        } else {
          formCtrl.first_name.$setValidity('required', true);
        }
      };
      
      var validateLastName = function(value) {
        if (!value) {
          formCtrl.last_name.$setValidity('required', false);
        } else {
          formCtrl.last_name.$setValidity('required', true);
        }
      };
      
      var validateEmail = function(value, ngModelCtrl) {
        $timeout(function() {
          var emailNgModelCtrl = emailInput.controller('ngModel');

          if (!value) {
            emailNgModelCtrl.$setValidity('required', false);
          } else if (!emailRegex.test(value)) {
            emailNgModelCtrl.$setValidity('email', false);
          } else {
            emailNgModelCtrl.$setValidity('email', true);
          }
        });
        // if (!value) {
        //   ngModelCtrl.$setValidity('required', false);
        // } else if (!emailRegex.test(value)) {
        //   ngModelCtrl.$setValidity('email', false);
        // } else {
        //   ngModelCtrl.$setValidity('email', true);
        // }
      };
      
      var validatePassword = function(value) {
        if (!value) {
          formCtrl.password.$setValidity('required', false);
        } else if (!passwordRegex.test(value)) {
          formCtrl.password.$setValidity('password', false);
        } else {
          formCtrl.password.$setValidity('password', true);
        }
      };
      
      var validateUserType = function(value) {
        if (!value) {
          formCtrl.user_type.$setValidity('required', false);
        } else if (!userTypeRegex.test(value)) {
          formCtrl.user_type.$setValidity('user_type', false);
        } else {
          formCtrl.user_type.$setValidity('user_type', true);
        }
      };
      
      var emailInput = element.find('input[name="email"]');
      // var emailNgModelCtrl = emailInput.controller('ngModel');

      var validateAllFields = function() {
        validateUsername(scope.user.username);
        validateFirstName(scope.user.first_name);
        validateLastName(scope.user.last_name);
        // validateEmail(scope.user.email);
        validateEmail(emailNgModelCtrl.$viewValue, emailNgModelCtrl);
        validatePassword(scope.user.password);
        validateUserType(scope.user.user_type);
      };

      
      scope.$watchGroup(['user.username', 'user.first_name', 'user.last_name', 'user.email', 'user.password', 'user.user_type'], function(newValues, oldValues, scope) {
        validateAllFields();
      });
    }
  };
});