module.exports = (user, link)=>{
    return `
        <p>This email has been sent to verify your email address on sevanmuni.com. In order to verify, please follow the link below.</p>

        <a href="${link}">${link}</a>
    `;
}