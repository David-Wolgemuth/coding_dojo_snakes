module.exports = ["userFactory", "$scope", "$window",
function LandingController (User, $scope, $window) {
    $scope.$parent.setCurrentTab("");

    $scope.error = null;
    $scope.signedInUser = User.me;
    console.log($scope.signedInUser);
    if (!$scope.signedInUser) {
        User.whoAmI(function (me) {
            $scope.signedInUser = me;
        });
    } 

    $scope.login = function (user) {
        User.login(user, function (err, loggedInUser) {
            if (err) {
                $scope.error = err;
            } else {
                $scope.signedInUser = loggedInUser;
                console.log("SIGNED IN:", $scope.signedInUser);
            }
        });
    };
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
    $scope.signOut = function () {
        User.signOut(function (err) {
            if (err) {
                console.log(err);
            } else {
                $scope.signedInUser = null;
                $window.location.href = "/";
            }
        });
    };
}];