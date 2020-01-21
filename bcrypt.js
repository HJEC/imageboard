const bcrypt = require("bcryptjs");
//salt - hash - compare
let { genSalt, hash, compare } = bcrypt;
const { promisify } = require("util");

genSalt = promisify(genSalt);
hash = promisify(hash);
compare = promisify(compare);

genSalt()
    .then(salt => {
        console.log("salt: ", salt);
        return hash("monkey", salt);
    })
    .then(hashedPass => {
        console.log(hashedPass);
        return compare("monkey", hashedPass);
    })
    .then(console.log());
