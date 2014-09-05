var app = angular.module('events', ['ngCookies', 'ngRoute','ngResource', 'ngSanitize', 'ngAnimate', 'ng-breadcrumbs', 'ngBootstrap', 'ngAutocomplete', 'ngTable', 'ngUpload', 'angularFileUpload', 'ui.bootstrap', 'ui.tinymce', 'chieffancypants.loadingBar']);

app.config(function ($routeProvider) {
    $routeProvider
        .when('/login',   {
            templateUrl: 'partials/login.html',
            controller: 'LoginCtrl',
            resolve: {
                login: function(AuthService, UserService, $location) {
                    if($.cookie('remember') == 1) {
                        AuthService.login(UserService.user, function() {
                            $location.path('/events');
                        });
                    }
                }
            }
        })
        .when('/:view', {
            templateUrl: "partials/events/default.html",
            controller: "EventsCtrl",
            reloadOnSearch: false
        })
        .when('/:view/add', {
            templateUrl: "partials/event/edit.html",
            controller: "EventsCtrl",
            reloadOnSearch: false
        })
        .when('/:view/:id', {
            templateUrl: "partials/event/default.html",
            controller: "EventsCtrl",
            reloadOnSearch: false
        })
        .when('/:view/:id/edit', {
            templateUrl: "partials/event/edit.html",
            controller: "EventsCtrl",
            reloadOnSearch: false
        })
        .when('/logout',  {
            templateUrl: 'partials/logout.html',
            controller: 'LogoutCtrl'
        })
        .otherwise({ redirectTo: '/login' });
});

app.config(['$httpProvider', function($httpProvider) {
    $httpProvider.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
}]);

app.config(function(cfpLoadingBarProvider) {
    cfpLoadingBarProvider.includeSpinner = true;
});

//app.config(['$httpProvider', function ($httpProvider) {
//    var interceptor = ['$q', 'AlertService', function ($q, AlertService) {
//        return {
//            'responseError': function(response) {
//                AlertService.addAlert('Oops. Something went wrong :(', 'danger', 2000);
//
//                return $q.reject(response);
//            }
//        };
//    }];
//
//    $httpProvider.interceptors.push(interceptor);
//}]);
//
//app.config( ['$routeProvider', function($routeProvider) {}] )
//    .run( function($rootScope, $location, AuthService, UserService) {
//        $rootScope.$on( "$routeChangeStart", function(event, next, current) {
//            console.log(UserService.user);
//
//            if($.cookie('remember') == 1 && UserService.user.loggedin === 0) {
//                AuthService.login(UserService.user).$promise.then(function() {
//                    $location.path('/events');
//                });
//            }
//        });
//    });