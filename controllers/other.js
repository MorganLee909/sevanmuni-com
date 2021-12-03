module.exports = {
    /*
    GET: Log out any user
    redirect: "/"
    */
    logout: function(req, res){
        req.session.user = undefined;

        return res.redirect("/");
    }
}