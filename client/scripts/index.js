var angular = require("angular");

require("angular-route");
require("angular-ui-codemirror");
require("angularjs-color-picker");

var snakeAppModule = angular.module("myApp", ["ngRoute", "ui.codemirror", "color.picker"]);

snakeAppModule.config(function ($routeProvider) {
    $routeProvider.when("/editor", {
        templateUrl: "views/editor.html"
    });
    $routeProvider.when("/arena", {
        templateUrl: "views/arena.html"
    });
    $routeProvider.when("/snakes", {
        templateUrl: "views/snakes.html"
    });
    $routeProvider.when("/docs", {
        templateUrl: "views/docs.html"
    });
    $routeProvider.when("/", {
        templateUrl: "views/landing-page.html"
    });
})
.factory("userFactory", require("./user-factory"))
.factory("snakeFactory", require("./snake-factory"))
.factory("arenaFactory", require("./arena-factory"))
.controller("masterController", require("./master-controller"))
.controller("arenaController", require("./arena-controller"))
.controller("editorController", require("./editor-controller"))
.controller("landingController", require("./landing-controller"))
.controller("snakesController", require("./snakes-controller"))
.controller("docsController", function ($scope) {
    $scope.$parent.setCurrentTab("docs");
});
