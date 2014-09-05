'use strict';

/* Directives */

app.directive('elements', function() {
    return {
        restrict: "E",
        transclude: true,
        templateUrl: "partials/elements/render.html"
    };
});

app.directive('bsNavbar', function($location, $cookies) {
    'use strict';

    return {
        restrict: 'A',
        link: function postLink(scope, element, attrs, controller) {
            // Watch for the $location
            scope.$watch(function() {
                return $location.path();
            }, function(newValue, oldValue) {

//                $('li[data-require-auth]', element).each(function(k, li) {
//                    var $li = angular.element(li),
//                        value = $li.attr('data-require-auth');
//
//                    if(value > ($cookies.isLoggedin ? parseInt($cookies.isLoggedin) : 0)) {
//                        $li.remove();
//                    }
//                });

                $('li[data-match-route]', element).each(function(k, li) {
                    var $li = angular.element(li),
                    // data('match-rout') does not work with dynamic attributes
                        pattern = $li.attr('data-match-route'),
                        regexp = new RegExp('^' + pattern + '$', ['i']);

                    if(regexp.test(newValue)) {
                        $li.addClass('active');
                    } else {
                        $li.removeClass('active');
                    }

                });
            });
        }
    };
});

app.directive('filters', function() {
    return {
        restrict: "E",
        transclude: true,
        templateUrl: "partials/filters/default.html"
    };
});
