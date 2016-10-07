
module.exports = function () {
    return {
        shuffleArray: function shuffleArray(arr)
        {
            // JS implementation of the Durstenfeld shuffle by StackOverflow user Laurens Holst
            // http://stackoverflow.com/a/12646864/5749040

            for (var i = arr.length-1; i>0; i--) {
                var j = Math.floor(Math.random()*(i+1));
                var temp = arr[i];
                arr[i] = arr[j];
                arr[j] = temp;
            }
        },
        mod: function mod(a,b){
            // Make % work for negative numbers
            return ( (a%b) + b) % b;
        },
        shallowCopy: function shallowCopy(obj){
            // Kludgy function to deep copy an array or object (so that any sub-arrays/objects will be copies, not references to the original)
            // This will break if the object holds any non-JSONible data (functions, undefined, and such), but that shouldn't be an issue for this project
            return JSON.parse(JSON.stringify(obj));
        },
        emptyGrid: function emptyGrid(size, f){
            if (!f) {
                f = ".";
            }
            var new_grid = new Array(size);
            for (var i = 0; i < new_grid.length; i++) {
                new_grid[i] = new Array(size).fill(f);
            }
            return new_grid;
        }
    };
};