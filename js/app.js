angular.module('myApp', ['ngRoute', 'ui.bootstrap', 'ngAnimate',
        'myApp.controllers', 'myApp.services', "myApp.directives"
    ])
    .config(function($routeProvider) {
        $routeProvider.when('/', {
                templateUrl: 'pages/index.html',
                controller: 'IndexCtrl'
            })
            .when('/categorys/:categoryId', {
                templateUrl: 'pages/categorys.html',
                controller: 'CategoryCtrl'
            })
            .when('/shop', {
                templateUrl: 'pages/shop.html',
                controller: 'ShopCtrl'
            })

        .when('/signin', {
                templateUrl: 'pages/user/signin.html',

                controller: 'SigninCtrl'
            })
            .when('/signup', {
                templateUrl: 'pages/user/signup.html',
                controller: 'SignupCtrl'
            })
            .when('/cart/:service', {
                templateUrl: 'pages/cart.html',
                controller: 'CartCtrl'
            })
            .otherwise('/');


    });