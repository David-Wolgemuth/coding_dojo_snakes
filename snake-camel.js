// var mod = require("./utilities")().mod;
// module.exports = 
// function snake_camel_case (map) {
//     var c = this.head.col;
//     var r = this.head.row;

//     var cc = this.head.next.col;
//     var rr = this.head.next.row;

//     var next = map[mod(r+(r-rr), map.length)][mod(c+(c-cc), map.length)];

//     function either (x, y) {
//         return (Math.random() < 0.5) ? x : y;   
//     }

//     function at (d) {
//         switch (d) {
//             case "n":
//                 return map[mod(r-1, map.length)][c];
//             case "s":
//                 return map[mod(r+1, map.length)][c];
//             case "e":
//                 return map[r][mod(c+1, map.length)];
//             case "w":
//                 return map[r][mod(c-1, map.length)];
//         }
//         return null;
//     }
//     // console.log(next);   
//     switch (next) {
//         case "*":
//             return "?";
//         case ".":
//             break;
//         default:
//             var dirs = ["n", "s", "e", "w"];
//             for (var i = 0; i < dirs.length; i++) {
//                 if (at(dirs[i]) === "*" || at(dirs[i]) === ".") {
//                     return dirs[i];
//                 }
//             }
//     }

//     switch (map[r][mod(c-1, map.length)]) {
//         case "*":
//             return "w";
//         case ".":
//             break;
//         case this.letter:
//             break;
//         default:
//             return either("n", "s");
//     }
//     switch (map[r][mod(c+1, map.length)]) {
//         case "*":
//             return "e";
//         case ".":
//             break;
//         case this.letter:
//             break;
//         default:
//             return either("n", "s");
//     }
//     switch (map[mod(r-1, map.length)][c]) {
//         case "*":
//             return "n";
//         case ".":
//             break;
//         case this.letter:
//             break;
//         default:
//             return either("e", "w");
//     }
//     switch (map[mod(r+1, map.length)][c]) {
//         case "*":
//             return "n";
//         case ".":
//             break;
//         case this.letter:
//             break;
//         default:
//             return either("e", "w");
//     }
//     return "?";
// }