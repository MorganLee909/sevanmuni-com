module.exports = (user, link)=>{
    return `
        <p>A password reset has been requested at sevenmuni.com for ${user.email}. If you requested this, then use the link below to reset your password.</p>

        <a href="${link}">${link}</a>

        <p>If you did not request this password reset, then you can safely ignore this email.</p>
    `;
}