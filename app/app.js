angular.module('myApp', ['ngRoute', 'ngDialog', 'LocalStorageModule'])
.config(function($routeProvider) {
  $routeProvider
  .when('/', {
    templateUrl: 'app/views/user-list.html',
    controller: 'UserListController'
  })
  .when('/error', {
    templateUrl: 'app/views/error-view.html',
    controller: 'ErrorController'
  })
  // .when('/users/:userId', {
  //   templateUrl: 'app/views/user-view.html',
  //   controller: 'UserViewController'
  // })
  .otherwise({
    redirectTo: '/'
  });
});