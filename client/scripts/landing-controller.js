module.exports = ["userFactory", "$scope", "$window", "$location",
function LandingController (User, $scope, $window, $location) {
    $scope.$parent.setCurrentTab("");

    $scope.error = null;
    $scope.signedInUser = User.me;
    if ($scope.signedInUser) {
        $location.url("/snakes");
    } 

    $scope.register = function (user) {
        if (user.password !== user.confirmPassword) {
            return $scope.error = "Passwords Do Not Match.";
        }
        User.register(user, function (err, loggedInUser) {
            if (err) {
                if (err.code === 11000) {
                    var key = err.errmsg.indexOf("username_1") >= 0 ? "Username" : "Email Address";
                    var value = /"(.+)"/.exec(err.errmsg)[0];
                    $scope.error = `${key}: ${value} Already Taken`;
                } else if (err.errors) {
                    $scope.error = err.errors.email.message;
                }
            } else {
                // Trigger Page Refresh
                document.location.href="/";
            }
        });
    };
    $scope.login = function (user) {
        User.login(user, function (err, loggedInUser) {
            console.log(err);
            if (err) {
                $scope.error = err;
            } else {
                // Trigger Page Refresh
                document.location.href="/";
            }
        });
    };
}];