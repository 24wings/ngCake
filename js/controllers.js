angular.module('myApp.controllers', ['ngRoute', 'myApp.services'])
    .controller('NavbarCtrl', function($http, $scope, $location, $interval, productService, UserService) {
        $scope.citys = [];
        $scope.productGroups = [];
        $scope.categoryNum = 0;
        $scope.category = 0;
        // 选中的城市
        $scope.selectedCity = "";
        $scope.isLogin = false;

        $http.get('data/citys.json').then(function(rtn) {
            $scope.citys = rtn.data;
            // 默认选中第一个城市
            $scope.selectedCity = $scope.citys[0];
        });
        // $scope.productNum

        $scope.selectCity = function(city) {
            $scope.selectedCity = city;
        };

        $http.get('data/products.json').then(function(rtn) {
            $scope.productGroups = rtn.data.productGroups;
        });

        $scope.goCategory = function(productGroupId) {
            $location.path('/categorys/' + productGroupId);
        };

        $scope.logout = function() {
            UserService.logout();
        };
        // 每秒自动刷新购物车
        $interval(function() {
            $scope.categoryNum = productService.getCategoryNum();
            $scope.allPrice = productService.getAllPrice();
            $scope.isLogin = UserService.isLogin();
        }, 1000);





    })
    .controller('IndexCtrl', function($http, $scope) {

    })
    .controller('CategoryCtrl', function($http, $scope, $routeParams, productService, $interval, $location) {
        $scope.productGroups = [];
        $scope.selectedProductGroup = {};
        $scope.isShowProductDetail = false;
        $scope.selectedImage = '';
        // 默认不显示产品详情
        $scope.selectedProduct = null;
        $http.get('data/products.json').then(function(rtn) {
            var selectedProductGroupId = $routeParams.categoryId;
            $scope.productGroups = rtn.data.productGroups;
            $scope.selectedProductGroup = rtn.data.productGroups.find(function(productGroup) {
                return productGroup.id == ~~selectedProductGroupId;
            });
            console.log($scope.selectedProductGroup);
        });

        $scope.lessProduct = function(product) {
            productService.lessProduct(product);
        };
        $scope.moreProduct = function(product) {

            productService.addProduct(product);
        };

        // 循环查询产品数量
        $interval(function() {
            // 每几秒自动轮询产品的添加数量
            $scope.selectedProductGroup.products.forEach(function(product) {
                for (var [key, value] of productService.getAllAddedProduct()) {
                    if (product.id == key.id) {
                        product.addedNum = value;
                    }

                }


            });


        }, 1000);
        $scope.selectProduct = function(product) {
            $scope.selectedProduct = product;
        };


        $scope.selectProductGroup = function(productGroup) {

            $scope.selectedProduct = null;
            $scope.selectedProductGroup = productGroup;
        };
        $scope.selectImage = function(image) {
            $scope.selectedImage = image;

        };
    })
    .controller('ShopCtrl', function($scope) {
        // 上面选择四个城市 beijing, shanghai ,guangzhou ,wuhan 
        $scope.citys = [{
                letter: "beijing",
                name: "北京",
                position: { x: 106.404, y: 39.915 }
            },
            {
                letter: "shanghai",
                name: "上海",
                position: { x: 96.404, y: 39.915 }
            },
            {
                letter: "hangzhou",
                name: "杭州",
                position: { x: 86.404, y: 39.915 }
            },
            {
                letter: "tianjin",
                name: "天津",
                position: { x: 76.404, y: 39.915 }
            }
        ];
        $scope.selectedCity = $scope.citys[0];
        $scope.map = new BMap.Map("allmap"); // 创建Map实例
        // 页面加载完成,自动加载百度地图  
        $scope.$on('$viewContentLoaded', function() {
            $scope.map.centerAndZoom(new BMap.Point($scope.selectedCity.position.x,
                $scope.selectedCity.position.y), 11); // 初始化地图,设置中心点坐标和地图级别
            $scope.map.addControl(new BMap.MapTypeControl()); //添加地图类型控件
            $scope.map.setCurrentCity("北京"); // 设置地图显示的城市 此项是必须设置的
            $scope.map.enableScrollWheelZoom(true);
            $('.selectpicker').selectpicker({
                style: 'btn-default'

            }).on('changed.bs.select', function() {
                $scope.selectCity($(this).val());
            });

        });

        $scope.selectCity = function(cityName) {
            $scope.selectedCity = $scope.citys.find(function(city) {
                return city.name == cityName;
            });
            $scope.map.centerAndZoom(new BMap.Point($scope.selectedCity.position.x, $scope.selectedCity.position.y), 11);

        };



    })
    .controller('SigninCtrl', function($scope, $timeout, UserService, $location) {
        console.log('欢迎进入登录界面');
        $scope.user = { username: "", password: "", keepSignin: false };
        $scope.errorMsg = "";

        $scope.signin = function() {
            UserService.login($scope.user.username, $scope.user.password, function(result) {
                if (result) {
                    $location.path('cart');
                } else {
                    $scope.errorMsg = "用户名或密码不正确";
                    $timeout(function() {
                        $scope.errorMsg = "";
                    }, 2000);
                }
            });
        };





    })
    .controller('SignupCtrl', function($scope) {
        console.log('欢迎进入注册页面');
    })
    .controller('CartCtrl', function($scope, productService, $interval, UserService, $location, $routeParams) {

        // 默认 7个服务
        $scope.selectedService = $routeParams.service ? $routeParams.service : "cart";
        $scope.selectService = function(service) {
            $scope.selectedService = service;
        };


        // 获取所有已经购买的商品
        $interval(function() {
            $scope.buyProducts = productService.getAllBuyProduct();
        }, 1000);



        // 清除商品
        $scope.deleteProduct = function(product) {
            productService.deleteProduct(product);
        };

        // 增加产品
        $scope.moreProduct = function(product) {
            productService.addProduct(product);
        };

        $scope.lessProduct = function(product) {
            productService.lessProduct(product);
        };

        $scope.goPersonCenter = function() {
            if (UserService.isLogin()) {
                $scope.selectedService = "person-center";
            } else {
                $location.path('signin');
            }


        };





        console.log('欢迎进入购物车');
    });