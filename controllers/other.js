module.exports = {
    /*
    GET: Log out any user
    redirect: "/"
    */
    logout: function(req, res){
        req.session.user = undefined;
        req.session.admin = undefined;

        return res.redirect("/");
    }
}