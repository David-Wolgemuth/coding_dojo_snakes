module.exports = ["arenaFactory", "snakeFactory", "$scope", "$timeout", "$location", "$routeParams",
function ArenaController (Arena, Snake, $scope, $timeout, $location, $routeParams)
{
    $scope.$parent.setCurrentTab("arena");
    $scope.timeInterval = 62;

    $scope.testingSnake = !!$routeParams["test-snake"];
    $scope.paused = true;

    console.log($scope.testingSnake);

    $scope.togglePause = function () { 
        $scope.paused = !$scope.paused;
        if (!$scope.paused) {
            runFrame();
        }
    };

    $scope.game = Arena.getCurrentGame();

    var timer;

    function runFrame () {
        if ($location.url().indexOf("arena") < 0 || $scope.paused) {
            return;
        }
        if ($scope.game.runFrame()) {
            $scope.curr_frame = $scope.game.lastFrame();
            $timeout(runFrame, $scope.timeInterval);
        }
    }

    if ($scope.game) {
        $scope.game.runFrame();
        $scope.curr_frame = $scope.game.lastFrame();
        
        runFrame();
    }
}];
