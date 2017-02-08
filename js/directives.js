angular.module('myApp.directives', []).directive('flytocart', function() {
    return {
        restrict: 'AEC',
        link: function(scope, element, attrs) {
            console.log(attrs);
            var ending = $('#cart').offset();
            $(element).click(function(e) {

                $('<img src="' + attrs.flytocart + '">').css({
                        width: '50px',
                        height: '50px',
                        position: 'absolute',
                        top: e.pageY,
                        left: e.pageX
                    }).appendTo('body')
                    .animate({
                        left: ending.left,
                        top: ending.top
                    }, 1000, function() {
                        $(this).remove();
                    });

            });
        }
    };

})