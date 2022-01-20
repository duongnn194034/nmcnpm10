// Thiết lập đối tượng, nội dung gửi mail
var mailOption = {
    from: 'NMCNPM',
    to: "",
    subject: "",
    rejectUnauthorized: false,
    text:""
  }
  
  module.exports = function sendMail() {
  
    this.mail = mailOption;
    this.verifyMail = function(receiver, link) {
      console.log(link);
      this.mail.to = receiver;
      this.mail.subject= '[SkyingShop] - Verify you Mail to login our SkyingShop',
      this.mail.text =  "You recieved message from SkyingShop. Here is you link for verifying your username, please click it. Thank you for using our service! \n Link: " + link;
  
    }
  
    this.resetMail = function (receiver) {
      this.mail.to = receiver
      this.mail.subject = '[SkyingClub] - Get your new password',
      this.mail.text = "You recieved message from SkyingClub. Your new password to login our web site is: ABCDE12345. Thank you for using our service ! "
    }
  }
  