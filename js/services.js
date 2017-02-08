angular.module('myApp.services', [])
    .service('productService', function($http) {
        var allProductGroups = [];
        var addedProduct = new Map();

        // 已经添加进的购物篮商品
        $http.get('data/products.json').then(function(rtn) {
            allProductGroups = rtn.data.productGroups;

            allProductGroups.forEach(function(productGroup) {
                for (var i = 0; i < productGroup.products.length; i++) {
                    addedProduct.set(productGroup.products[i], 0);
                }

            });
        });




        this.getAllAddedProduct = function() {
            return addedProduct;
        };
        // 已经添加进购物车的商品
        this.getAllBuyProduct = function() {
            var buyProducts = []
            for (var [key, value] of addedProduct) {
                if (value > 0) {
                    key.addedNum = value;
                    buyProducts.push(key);
                }
            }
            return buyProducts;

        }




        // 添加商品到购物车
        this.addProduct = function(product) {
            if (addedProduct.has(product)) {
                addedProduct.set(product, addedProduct.get(product) + 1);
            } else {
                addedProduct.set(product, 1);
            }
            console.log(addedProduct);
        }

        // 减少商品
        this.lessProduct = function(product) {
            if (addedProduct.has(product) && addedProduct.get(product) > 1) {
                addedProduct.set(product, addedProduct.get(product) - 1);
            } else {
                addedProduct.set(product, 0);
            }
            console.log(addedProduct);
        };
        this.deleteProduct = function(product) {
            debugger;
            if (addedProduct.has(product) && addedProduct.get(product) > 0) {
                addedProduct.set(product, 0);
            } else {
                alert('errror');

            }

        }



        // 获取商品数量
        this.getProductNum = function(product) {
            return addedProduct.get(product);
        };

        // 获取商品数量不为0的商品种类
        this.getCategoryNum = function() {
            var count = 0;
            for (var [key, value] of addedProduct) {
                value > 0 ? ++count : 0;
            }
            return count;
        }

        // 获取所有商品的总价
        this.getAllPrice = function() {
            var count = 0;
            for (var [key, value] of addedProduct) {
                count += key.price * value;
            }
            return count;
        };


        this.getProductById = function(groupId, productId) {
            var group = allProductGroups.find(function(group) {
                return group.id === groupId;
            });

            var product = group.products.find(function(product) {
                return product.id === productId;
            });

            return product;
        };


    })
    // 用户信息的服务
    .service('UserService', function($http) {
        var user = { username: '', password: '', isLogin: true, keepPassword: false };

        // 是否已经登录
        this.isLogin = function() {
            return user.isLogin;
        };

        // 登录
        this.login = function(username, password, callback) {
            $http.get('data/user.json').then(function(rtn) {
                var result = rtn.data.username == username && rtn.data.password == password;
                callback(result);
                user.isLogin = result;
                if (result) {
                    user.username = username;
                    user.password = password;
                }
            });
        };
        // 登出
        this.logout = function() {
            user.isLogin = false;
            user.username = "";
            user.password = "";
        }



    });