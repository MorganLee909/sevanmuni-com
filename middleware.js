let User = require("./models/user.js");

module.exports = {
    auth: function(allowed){
        return (req, res, next)=>{
            switch(allowed){
                case "user":
                    res.locals.user = await User.findOne({session: req.bo})
            }
        }
    },

    getUser: async function(){
        let user = 
    }
}