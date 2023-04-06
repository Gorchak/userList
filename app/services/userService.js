angular
  .module("myApp")
  .factory("UserService", function ($http) {
    function getUsers() {
      return new Promise(function(resolve, reject) {
        if(localStorage.getItem("userList")) {
          resolve(JSON.parse(localStorage.getItem("userList")));
        } else {
          $http.get("../data/users.json").then(
            function (response) {
              localStorage.setItem("userList", JSON.stringify(response.data));
              resolve(response.data);
            },
            function (error) {
              reject(error);
            }
          );
        }
      });
    }

    function getUserById(userId) {
      return getUsers().then(function (users) {
        return users.find(function (user) {
          return user.id === parseInt(userId);
        });
      });
    }

    function createUser(user) {
      return getUsers().then(function (users) {
        // Check if a user with the same username already exists
        var existingUser = users.find(function (u) {
          return u.username === user.username;
        });
        if (existingUser) {
          return Promise.reject({status: 403, message: "User with this username field already exists"});
        } else {
          user.id = users.length + 1;
          users.push(user);
          localStorage.setItem("userList", JSON.stringify(users));

          return Promise.resolve({status: 200, message: "User successfully added"});
        }
      });
    }

    function updateUser(user) {
      var users = JSON.parse(localStorage.getItem("userList"));
    
      var index = users.findIndex(function (u) {
        return u.id === user.id;
      });
      if (index >= 0) {
        users[index] = user;
        localStorage.setItem("userList", JSON.stringify(users));
        return Promise.resolve({status: 200, message: "User successfully updated"});
      }
      return Promise.reject({status: 404, message: "User not found."});
    }

    function deleteUser(userId) {
      var users = JSON.parse(localStorage.getItem("userList"));

      var index = users.findIndex(function (user) {
        return user.id === parseInt(userId);
      });
      if (index >= 0) {
        users.splice(index, 1);
        localStorage.setItem("userList", JSON.stringify(users));
        return Promise.resolve();
      }
      return Promise.reject(new Error("User deletion failed with an error."));
    }

    function validateUser(user) {
      var errors = [];
      if (!user.username) {
        errors.push("Username is required");
      }
      if (!user.firstName) {
        errors.push("First name is required");
      }
      if (!user.lastName) {
        errors.push("Last name is required");
      }
      if (!user.email) {
        errors.push("Email is required");
      } else if (!isValidEmail(user.email)) {
        errors.push("Email is invalid");
      }
      if (!user.password) {
        errors.push("Password is required");
      } else if (!isValidPassword(user.password)) {
        errors.push(
          "Password must be at least 8 characters long and contain at least one letter and one number"
        );
      }
      if (!user.userType) {
        errors.push("User type is required");
      } else if (!isValidUserType(user.userType)) {
        errors.push("User type is invalid");
      }
      return errors;
    }

    function isValidEmail(email) {
      // Use a regular expression to check if the email address is valid
      var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    }

    function isValidPassword(password) {
      // Password must be at least 8 characters long and contain at least one letter and one number
      var passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
      return passwordRegex.test(password);
    }

    function isValidUserType(userType) {
      // User type must be either "Admin" or "Driver"
      return userType === "Admin" || userType === "Driver";
    }

    return {
      getUsers: getUsers,
      getUserById: getUserById,
      createUser: createUser,
      updateUser: updateUser,
      deleteUser: deleteUser,
      validateUser: validateUser,
    };
  });
