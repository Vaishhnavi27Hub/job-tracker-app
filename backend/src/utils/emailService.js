// const nodemailer = require('nodemailer');

// // Create transporter with Gmail - with better error handling
// const createTransporter = () => {
//   const emailUser = process.env.EMAIL_USER;
//   const emailPass = process.env.EMAIL_PASS;

//   // Debug: Check if credentials are loaded
//   console.log('📧 Email Configuration:');
//   console.log('   EMAIL_USER:', emailUser ? '✅ Loaded' : '❌ Missing');
//   console.log('   EMAIL_PASS:', emailPass ? '✅ Loaded' : '❌ Missing');

//   if (!emailUser || !emailPass) {
//     console.error('❌ Email credentials missing in .env file!');
//     return null;
//   }

//   return nodemailer.createTransport({
//     service: 'gmail',
//     auth: {
//       user: emailUser,
//       pass: emailPass
//     }
//   });
// };

// // Send individual alert email
// const sendAlertEmail = async (userEmail, userName, alert, job) => {
//   try {
//     const transporter = createTransporter();
    
//     if (!transporter) {
//       console.error('❌ Cannot send email: Transporter not configured');
//       return false;
//     }

//     const jobInfo = job ? `for ${job.company} - ${job.position}` : '';
//     const alertTime = new Date(alert.alertDate).toLocaleString('en-US', {
//       weekday: 'long',
//       year: 'numeric',
//       month: 'long',
//       day: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit'
//     });

//     const mailOptions = {
//       from: process.env.EMAIL_USER,
//       to: userEmail,
//       subject: `⏰ Reminder: ${alert.title}`,
//       html: `
//         <!DOCTYPE html>
//         <html>
//         <head>
//           <style>
//             body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
//             .container { max-width: 600px; margin: 0 auto; padding: 20px; }
//             .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
//                      color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
//             .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
//             .alert-box { background: white; padding: 20px; border-left: 4px solid #667eea; 
//                         margin: 20px 0; border-radius: 5px; }
//             .priority-high { border-left-color: #e74c3c; }
//             .priority-medium { border-left-color: #f39c12; }
//             .priority-low { border-left-color: #3498db; }
//             .button { display: inline-block; padding: 12px 30px; background: #667eea; 
//                      color: white; text-decoration: none; border-radius: 5px; margin-top: 20px; }
//             .footer { text-align: center; color: #999; font-size: 12px; margin-top: 30px; }
//           </style>
//         </head>
//         <body>
//           <div class="container">
//             <div class="header">
//               <h1>🔔 Job Tracker Reminder</h1>
//             </div>
//             <div class="content">
//               <p>Hi <strong>${userName}</strong>,</p>
//               <p>This is a reminder about your upcoming task:</p>
              
//               <div class="alert-box priority-${alert.priority}">
//                 <h2 style="margin-top: 0; color: #667eea;">${alert.title}</h2>
//                 ${alert.description ? `<p><strong>Details:</strong> ${alert.description}</p>` : ''}
//                 ${jobInfo ? `<p><strong>Related Job:</strong> ${jobInfo}</p>` : ''}
//                 <p><strong>⏰ Due:</strong> ${alertTime}</p>
//                 <p><strong>Priority:</strong> <span style="text-transform: uppercase; color: ${
//                   alert.priority === 'high' ? '#e74c3c' : 
//                   alert.priority === 'medium' ? '#f39c12' : '#3498db'
//                 }">${alert.priority}</span></p>
//                 <p><strong>Type:</strong> ${alert.type.replace('-', ' ').toUpperCase()}</p>
//               </div>

//               <p>Don't forget to complete this task on time!</p>
              
//               <a href="http://localhost:3000/alerts" class="button">View All Alerts</a>
              
//               <div class="footer">
//                 <p>This is an automated reminder from Job Application Tracker</p>
//                 <p>You can manage your notification settings in your account preferences</p>
//               </div>
//             </div>
//           </div>
//         </body>
//         </html>
//       `
//     };

//     await transporter.sendMail(mailOptions);
//     console.log(`✅ Alert email sent to ${userEmail}`);
//     return true;
//   } catch (error) {
//     console.error('❌ Error sending alert email:', error.message);
//     return false;
//   }
// };

// // Send daily digest email
// const sendDailyDigest = async (userEmail, userName, alerts) => {
//   try {
//     const transporter = createTransporter();
    
//     if (!transporter) {
//       console.error('❌ Cannot send email: Transporter not configured');
//       return false;
//     }

//     const alertsHTML = alerts.map(alert => {
//       const jobInfo = alert.jobId ? `${alert.jobId.company} - ${alert.jobId.position}` : 'General';
//       const alertTime = new Date(alert.alertDate).toLocaleString('en-US', {
//         month: 'short',
//         day: 'numeric',
//         hour: '2-digit',
//         minute: '2-digit'
//       });
      
//       return `
//         <div style="background: white; padding: 15px; margin: 10px 0; border-left: 4px solid ${
//           alert.priority === 'high' ? '#e74c3c' : 
//           alert.priority === 'medium' ? '#f39c12' : '#3498db'
//         }; border-radius: 5px;">
//           <h3 style="margin: 0 0 10px 0; color: #333;">${alert.title}</h3>
//           <p style="margin: 5px 0;"><strong>📅 Due:</strong> ${alertTime}</p>
//           <p style="margin: 5px 0;"><strong>💼 Job:</strong> ${jobInfo}</p>
//           <p style="margin: 5px 0;"><strong>🔔 Type:</strong> ${alert.type.replace('-', ' ')}</p>
//         </div>
//       `;
//     }).join('');

//     const mailOptions = {
//       from: process.env.EMAIL_USER,
//       to: userEmail,
//       subject: `📋 Daily Job Tracker Digest - ${alerts.length} Upcoming Reminders`,
//       html: `
//         <!DOCTYPE html>
//         <html>
//         <head>
//           <style>
//             body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
//             .container { max-width: 600px; margin: 0 auto; padding: 20px; }
//             .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
//                      color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
//             .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
//             .button { display: inline-block; padding: 12px 30px; background: #667eea; 
//                      color: white; text-decoration: none; border-radius: 5px; margin-top: 20px; }
//             .footer { text-align: center; color: #999; font-size: 12px; margin-top: 30px; }
//           </style>
//         </head>
//         <body>
//           <div class="container">
//             <div class="header">
//               <h1>📋 Daily Job Tracker Digest</h1>
//               <p style="margin: 10px 0 0 0; font-size: 16px;">Your Upcoming Reminders</p>
//             </div>
//             <div class="content">
//               <p>Hi <strong>${userName}</strong>,</p>
//               <p>You have <strong>${alerts.length}</strong> upcoming reminders for the next 7 days:</p>
              
//               ${alertsHTML}
              
//               <a href="http://localhost:3000/alerts" class="button">View All Alerts</a>
              
//               <div class="footer">
//                 <p>This is your daily digest from Job Application Tracker</p>
//                 <p>Sent every day at 8:00 AM</p>
//               </div>
//             </div>
//           </div>
//         </body>
//         </html>
//       `
//     };

//     await transporter.sendMail(mailOptions);
//     console.log(`✅ Daily digest sent to ${userEmail}`);
//     return true;
//   } catch (error) {
//     console.error('❌ Error sending daily digest:', error.message);
//     return false;
//   }
// };

// module.exports = { sendAlertEmail, sendDailyDigest };






























const sgMail = require('@sendgrid/mail');

// Set SendGrid API Key
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendAlertEmail = async (userEmail, alert) => {
  try {
    const msg = {
      to: userEmail,
      from: process.env.SENDGRID_VERIFIED_SENDER, // vaishnavikadiyala27@gmail.com
      subject: `🔔 Job Alert: ${alert.title}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .alert-box { background: white; padding: 20px; border-left: 4px solid #667eea; margin: 20px 0; border-radius: 5px; }
            .priority-high { border-left-color: #ef4444; }
            .priority-medium { border-left-color: #f59e0b; }
            .priority-low { border-left-color: #10b981; }
            .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin-top: 20px; }
            .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎯 Job Application Alert</h1>
            </div>
            <div class="content">
              <div class="alert-box priority-${alert.priority}">
                <h2>${alert.title}</h2>
                <p><strong>Type:</strong> ${alert.type}</p>
                <p><strong>Due:</strong> ${new Date(alert.alertDate).toLocaleString()}</p>
                <p><strong>Priority:</strong> <span style="text-transform: uppercase;">${alert.priority}</span></p>
                ${alert.description ? `<p><strong>Details:</strong> ${alert.description}</p>` : ''}
                ${alert.jobApplication ? `<p><strong>Related Job:</strong> ${alert.jobApplication.company} - ${alert.jobApplication.position}</p>` : ''}
              </div>
              <p>This is a reminder for your upcoming task. Don't forget to take action!</p>
              <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/alerts" class="button">View All Alerts</a>
            </div>
            <div class="footer">
              <p>You're receiving this because you enabled email notifications in Job Tracker</p>
              <p>To stop receiving these emails, update your notification preferences</p>
            </div>
          </div>
        </body>
        </html>
      `
    };

    await sgMail.send(msg);
    console.log(`✅ Alert email sent to ${userEmail} for alert: ${alert.title}`);
    return { success: true };
  } catch (error) {
    console.error('❌ SendGrid Error:', error);
    if (error.response) {
      console.error('Error details:', error.response.body);
    }
    return { success: false, error: error.message };
  }
};

const sendDailyDigest = async (userEmail, alerts) => {
  try {
    const alertsList = alerts.map(alert => `
      <div class="alert-item priority-${alert.priority}">
        <h3>${alert.title}</h3>
        <p><strong>Type:</strong> ${alert.type}</p>
        <p><strong>Due:</strong> ${new Date(alert.alertDate).toLocaleString()}</p>
        ${alert.description ? `<p>${alert.description}</p>` : ''}
      </div>
    `).join('');

    const msg = {
      to: userEmail,
      from: process.env.SENDGRID_VERIFIED_SENDER,
      subject: `📋 Your Daily Job Alerts Summary (${alerts.length} alerts)`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .alert-item { background: white; padding: 15px; margin: 15px 0; border-left: 4px solid #667eea; border-radius: 5px; }
            .priority-high { border-left-color: #ef4444; }
            .priority-medium { border-left-color: #f59e0b; }
            .priority-low { border-left-color: #10b981; }
            .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin-top: 20px; }
            .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>📋 Daily Alerts Summary</h1>
              <p>You have ${alerts.length} alert(s) for today</p>
            </div>
            <div class="content">
              ${alertsList}
              <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/alerts" class="button">Manage All Alerts</a>
            </div>
            <div class="footer">
              <p>Job Application Tracker - Stay organized, land your dream job!</p>
            </div>
          </div>
        </body>
        </html>
      `
    };

    await sgMail.send(msg);
    console.log(`✅ Daily digest sent to ${userEmail}`);
    return { success: true };
  } catch (error) {
    console.error('❌ SendGrid Error:', error);
    if (error.response) {
      console.error('Error details:', error.response.body);
    }
    return { success: false, error: error.message };
  }
};

module.exports = { sendAlertEmail, sendDailyDigest };