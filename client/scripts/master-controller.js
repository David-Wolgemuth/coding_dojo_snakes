module.exports = ["userFactory", "$scope", "$location",
function MasterController (User, $scope, $location) {
    User.whoAmI(function (me) {
        $scope.me = me;
    });
    $scope.signOut = function () {
        User.signOut(function () {
            $scope.me = null;
            $location.url("/login");
        });
    };
    $scope.setCurrentTab = function (tab) {
        $scope.currentTab = tab;
    };
    $scope.goToTab = function (tab) {
        $scope.currentTab = tab;
        $location.url("/" + tab);
    };
    $scope.login = function (user) {
        User.login(user, function (err, loggedInUser) {
            if (err) {
                $scope.error = err;
            } else {
                $scope.me = loggedInUser;
                $location.url("/snakes");
            }
        });
    };
}];