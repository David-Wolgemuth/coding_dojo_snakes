
module.exports = ["snakeFactory", "userFactory", "arenaFactory", "$scope", "$location",
function SnakesController (Snake, User, Arena, $scope, $location)
{
    $scope.$parent.setCurrentTab("snakes");

    $scope.selected = [];

    User.whoAmI(function (me) {
        $scope.me = User.me;
    });


    Snake.index(function (snakes) {
        $scope.snakes = [];
        $scope.mySnakes = [];

        for (var i = 0; i < snakes.length; i++) {
            if (snakes[i]._user._id === User.me._id || snakes[i]._user === User.me._id) {
                $scope.mySnakes.push(snakes[i]);
            } else {
                $scope.snakes.push(snakes[i]);
            }
        }
    });
    $scope.createMatch = function ()
    {
        Arena.makeNewGame($scope.selected);
        $location.url("/arena");
    };
    $scope.edit = function (snake)
    {
        Snake.current = snake;
        $location.url("/editor");
    };
    $scope.star = function (snake)
    {
        Snake.star(snake);
    };
    $scope.delete = function (snake)
    {
        Snake.delete(snake, function () {
            $scope.mySnakes.splice($scope.mySnakes.indexOf(snake), 1);
        });
    };
    $scope.select = function (snake)
    {
        var idx = $scope.selected.indexOf(snake);
        if (idx < 0) {
            $scope.selected.push(snake);
        } else {
            $scope.selected.splice(idx, 1);
        }
    };
}];