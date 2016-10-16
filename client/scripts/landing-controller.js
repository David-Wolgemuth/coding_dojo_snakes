module.exports = ["userFactory", "$scope", "$window", "$location",
function LandingController (User, $scope, $window, $location) {
    $scope.$parent.setCurrentTab("");

    $scope.error = null;
    $scope.signedInUser = User.me;
    if ($scope.signedInUser) {
        $location.url("/snakes");
    } 

    $scope.register = function (user) {
        console.log(user);
        User.register(user, function (err, loggedInUser) {
            if (err) {
                $scope.error = err;
            } else {
                console.log("LOGGED IN", loggedInUser);
            }
        });
    };
}];