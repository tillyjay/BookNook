const bcrypt = require('bcrypt')

bcrypt.hash('abc123', 15, (err, hash) => {
    console.log(hash);
})


bcrypt.compare('abc123', '$2b$15$H39KGC1MarP3xGDKDJ48hOfTZyf4qMYH5XuxP7N53FIGtuyHnDrX2'
                        , (err, isMatch) => {
                            console.log(isMatch);
                        }
)