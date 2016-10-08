var TIMER_INTERVAL = 62;
var SnakeGame = require("./game");

var myAppModule = angular.module("myApp", []);
myAppModule.controller("snakeController", function($scope, $interval){

    var game = new SnakeGame(bots, true);
    game.run();

    $scope.frame = -1;

    function changeGrid(){
        $scope.frame++;

        if ($scope.frame == game.log.length) {
            $interval.cancel(timer);
        } else {
            $scope.curr_frame = game.log[$scope.frame];
        }
    }

    timer = $interval(changeGrid, TIMER_INTERVAL);

    $scope.$on("$destroy", function() {
        $interval.cancel(timer);
    });
});