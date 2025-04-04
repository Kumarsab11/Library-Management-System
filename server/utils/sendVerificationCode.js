import { genenerateVerificationOtpEmailTemplate } from "./emailTemplates.js";
import { sendEmail } from "./sendEmail.js";

export async function sendVerificationCode(verificationCode, email, res) {
  try {
    const message = genenerateVerificationOtpEmailTemplate(verificationCode);
    sendEmail({
      email,
      subject: "Verification Code(BookWorm Library Managment System)",
      message,
    });
    res.status(200).json({
      success: true,
      message: "Verification code sent successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "verification code failed to send.",
    });
  }
}
