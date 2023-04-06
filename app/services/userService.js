angular.module("myApp").factory("UserService", function ($http) {
  function getUsers() {
    return new Promise(function (resolve, reject) {
      if (localStorage.getItem("userList")) {
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
        return Promise.reject({
          status: 403,
          message: "User with this username field already exists",
        });
      } else {
        user.id = users.length + 1;
        users.push(user);
        localStorage.setItem("userList", JSON.stringify(users));

        return Promise.resolve({
          status: 200,
          message: "User successfully added",
        });
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
      return Promise.resolve({
        status: 200,
        message: "User successfully updated",
      });
    }
    return Promise.reject({ status: 404, message: "User not found." });
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

  return {
    getUsers: getUsers,
    getUserById: getUserById,
    createUser: createUser,
    updateUser: updateUser,
    deleteUser: deleteUser,
  };
});
