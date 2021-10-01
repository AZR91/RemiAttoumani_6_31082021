module.exports = (req, res, next) => {
    console.log("Je passe par ici!");
    // console.log(res);
    const validEmail = (email) => {
        console.log(email);
        let emailRegexp = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        let isRegexTrue = emailRegexp.test(email);
        isRegexTrue ? next() : res.status(400).json({ message: 'mail non valide' });
    }
    validEmail(req.body.email)
};