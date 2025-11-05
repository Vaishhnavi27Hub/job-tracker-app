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


































const nodemailer = require('nodemailer');

// Create transporter with Gmail - with better error handling
const createTransporter = () => {
  const emailUser = process.env.EMAIL_USER;
  const emailPass = process.env.EMAIL_PASS;

  // Debug: Check if credentials are loaded
  console.log('📧 Email Configuration:');
  console.log('   EMAIL_USER:', emailUser ? '✅ Loaded' : '❌ Missing');
  console.log('   EMAIL_PASS:', emailPass ? '✅ Loaded' : '❌ Missing');

  if (!emailUser || !emailPass) {
    console.error('❌ Email credentials missing in .env file!');
    return null;
  }

  return nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // Use TLS
    auth: {
      user: emailUser,
      pass: emailPass
    },
    tls: {
      rejectUnauthorized: false
    },
    connectionTimeout: 10000, // 10 seconds
    greetingTimeout: 10000,
    socketTimeout: 10000
  });
};

// Get the correct app URL based on environment
const getAppUrl = () => {
  return process.env.FRONTEND_URL || 'https://job-tracker-app-amber.vercel.app';
};

// Send individual alert email
const sendAlertEmail = async (userEmail, userName, alert, job) => {
  try {
    console.log(`📧 Attempting to send email to ${userEmail}...`);
    
    const transporter = createTransporter();
    
    if (!transporter) {
      console.error('❌ Cannot send email: Transporter not configured');
      return false;
    }

    const jobInfo = job ? `for ${job.company} - ${job.position}` : '';
    const alertTime = new Date(alert.alertDate).toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    const appUrl = getAppUrl();

    const mailOptions = {
      from: `"Job Tracker" <${process.env.EMAIL_USER}>`,
      to: userEmail,
      subject: `⏰ Reminder: ${alert.title}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                     color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .alert-box { background: white; padding: 20px; border-left: 4px solid #667eea; 
                        margin: 20px 0; border-radius: 5px; }
            .priority-high { border-left-color: #e74c3c; }
            .priority-medium { border-left-color: #f39c12; }
            .priority-low { border-left-color: #3498db; }
            .button { display: inline-block; padding: 12px 30px; background: #667eea; 
                     color: white; text-decoration: none; border-radius: 5px; margin-top: 20px; }
            .footer { text-align: center; color: #999; font-size: 12px; margin-top: 30px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🔔 Job Tracker Reminder</h1>
            </div>
            <div class="content">
              <p>Hi <strong>${userName}</strong>,</p>
              <p>This is a reminder about your upcoming task:</p>
              
              <div class="alert-box priority-${alert.priority}">
                <h2 style="margin-top: 0; color: #667eea;">${alert.title}</h2>
                ${alert.description ? `<p><strong>Details:</strong> ${alert.description}</p>` : ''}
                ${jobInfo ? `<p><strong>Related Job:</strong> ${jobInfo}</p>` : ''}
                <p><strong>⏰ Due:</strong> ${alertTime}</p>
                <p><strong>Priority:</strong> <span style="text-transform: uppercase; color: ${
                  alert.priority === 'high' ? '#e74c3c' : 
                  alert.priority === 'medium' ? '#f39c12' : '#3498db'
                }">${alert.priority}</span></p>
                <p><strong>Type:</strong> ${alert.type.replace('-', ' ').toUpperCase()}</p>
              </div>

              <p>Don't forget to complete this task on time!</p>
              
              <a href="${appUrl}/alerts" class="button">View All Alerts</a>
              
              <div class="footer">
                <p>This is an automated reminder from Job Application Tracker</p>
                <p>You can manage your notification settings in your account preferences</p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `
    };

    console.log(`📤 Sending email from ${mailOptions.from} to ${mailOptions.to}...`);
    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Alert email sent successfully! Message ID: ${info.messageId}`);
    return true;
  } catch (error) {
    console.error('❌ Error sending alert email:', error.message);
    console.error('❌ Error code:', error.code);
    console.error('❌ Full error:', error);
    return false;
  }
};

// Send daily digest email
const sendDailyDigest = async (userEmail, userName, alerts) => {
  try {
    const transporter = createTransporter();
    
    if (!transporter) {
      console.error('❌ Cannot send email: Transporter not configured');
      return false;
    }

    const alertsHTML = alerts.map(alert => {
      const jobInfo = alert.jobId ? `${alert.jobId.company} - ${alert.jobId.position}` : 'General';
      const alertTime = new Date(alert.alertDate).toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
      
      return `
        <div style="background: white; padding: 15px; margin: 10px 0; border-left: 4px solid ${
          alert.priority === 'high' ? '#e74c3c' : 
          alert.priority === 'medium' ? '#f39c12' : '#3498db'
        }; border-radius: 5px;">
          <h3 style="margin: 0 0 10px 0; color: #333;">${alert.title}</h3>
          <p style="margin: 5px 0;"><strong>📅 Due:</strong> ${alertTime}</p>
          <p style="margin: 5px 0;"><strong>💼 Job:</strong> ${jobInfo}</p>
          <p style="margin: 5px 0;"><strong>🔔 Type:</strong> ${alert.type.replace('-', ' ')}</p>
        </div>
      `;
    }).join('');

    const appUrl = getAppUrl();

    const mailOptions = {
      from: `"Job Tracker" <${process.env.EMAIL_USER}>`,
      to: userEmail,
      subject: `📋 Daily Job Tracker Digest - ${alerts.length} Upcoming Reminders`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                     color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .button { display: inline-block; padding: 12px 30px; background: #667eea; 
                     color: white; text-decoration: none; border-radius: 5px; margin-top: 20px; }
            .footer { text-align: center; color: #999; font-size: 12px; margin-top: 30px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>📋 Daily Job Tracker Digest</h1>
              <p style="margin: 10px 0 0 0; font-size: 16px;">Your Upcoming Reminders</p>
            </div>
            <div class="content">
              <p>Hi <strong>${userName}</strong>,</p>
              <p>You have <strong>${alerts.length}</strong> upcoming reminders for the next 7 days:</p>
              
              ${alertsHTML}
              
              <a href="${appUrl}/alerts" class="button">View All Alerts</a>
              
              <div class="footer">
                <p>This is your daily digest from Job Application Tracker</p>
                <p>Sent every day at 8:00 AM</p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log(`✅ Daily digest sent to ${userEmail}`);
    return true;
  } catch (error) {
    console.error('❌ Error sending daily digest:', error.message);
    return false;
  }
};

module.exports = { sendAlertEmail, sendDailyDigest };