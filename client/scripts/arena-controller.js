module.exports = ["arenaFactory", "snakeFactory", "userFactory", "$scope", "$timeout", "$location", "$routeParams",
function ArenaController (Arena, Snake, User, $scope, $timeout, $location, $routeParams)
{

    User.whoAmI(function (me) {
        if (!me) {
            $location.url("/login");
        }
    });

    $scope.$parent.setCurrentTab("arena");
    $scope.timeInterval = 62;
    $scope.consoleVisible = true;

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

    console.log($scope.game);
    var timer;

    function runFrame () {
        if ($location.url().indexOf("arena") < 0 || $scope.paused) {
            return;
        }
        if ($scope.game.runFrame()) {
            $scope.curr_frame = $scope.game.lastFrame();
            console.log($scope.game.consoleLog);
            $timeout(runFrame, $scope.timeInterval);
        }
    }

    if ($scope.game) {
        $scope.game.runFrame();
        $scope.curr_frame = $scope.game.lastFrame();
        runFrame();
    }
}];
