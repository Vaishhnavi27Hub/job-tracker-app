// const cron = require("node-cron");
// const Alert = require("../models/Alert");
// const User = require("../models/User");
// const { sendAlertEmail, sendDailyDigest } = require("./emailService");

// // Check alerts every MINUTE and send emails
// const startAlertScheduler = () => {
//   // Run every minute to check for alerts
//   cron.schedule("* * * * *", async () => {
//     await checkAndSendAlerts();
//   });

//   // Send daily digest at 8 AM every day
//   cron.schedule("0 8 * * *", async () => {
//     console.log("📧 Sending daily digest emails...");
//     await sendDailyDigests();
//   });

//   console.log("✅ Alert scheduler started (checking every minute)");
// };

// // Check and send instant alert emails
// const checkAndSendAlerts = async () => {
//   try {
//     const now = new Date();
    
//     // Get current time boundaries (current minute only)
//     const currentMinuteStart = new Date(now);
//     currentMinuteStart.setSeconds(0, 0); // Start of current minute
    
//     const currentMinuteEnd = new Date(now);
//     currentMinuteEnd.setSeconds(59, 999); // End of current minute

//     // Find alerts due ONLY in the current minute that haven't been emailed
//     const alerts = await Alert.find({
//       alertDate: { 
//         $gte: currentMinuteStart,
//         $lte: currentMinuteEnd
//       },
//       isCompleted: false,
//       emailSent: false,
//     }).populate("userId", "name email emailNotifications")
//       .populate("jobId", "company position");

//     if (alerts.length > 0) {
//       console.log(`🔔 Found ${alerts.length} alerts to send at ${now.toLocaleTimeString()}`);
//     }

//     for (const alert of alerts) {
//       if (!alert.userId) {
//         console.log(`⚠️ Alert ${alert._id} has no user, skipping`);
//         continue;
//       }

//       const user = alert.userId;

//       // Check if user has email notifications enabled
//       if (
//         user.emailNotifications?.enabled &&
//         user.emailNotifications?.frequency === "instant" &&
//         user.emailNotifications?.types?.includes(alert.type)
//       ) {
//         // Send email
//         const emailSent = await sendAlertEmail(
//           user.email,
//           user.name,
//           alert,
//           alert.jobId
//         );

//         if (emailSent) {
//           // Mark as sent
//           alert.emailSent = true;
//           alert.emailSentAt = new Date();
//           await alert.save();
//           console.log(`✅ Alert email sent to ${user.email}: "${alert.title}"`);
//         }
//       }
//     }
//   } catch (error) {
//     console.error("❌ Error checking alerts:", error.message);
//   }
// };

// // Send daily digest emails
// const sendDailyDigests = async () => {
//   try {
//     const users = await User.find({
//       "emailNotifications.enabled": true,
//       "emailNotifications.frequency": "daily",
//     });

//     console.log(`Sending daily digest to ${users.length} users`);

//     for (const user of users) {
//       const nextWeek = new Date();
//       nextWeek.setDate(nextWeek.getDate() + 7);

//       const alerts = await Alert.find({
//         userId: user._id,
//         alertDate: { $lte: nextWeek },
//         isCompleted: false,
//       }).populate("jobId", "company position");

//       if (alerts.length > 0) {
//         await sendDailyDigest(user.email, user.name, alerts);
//       }
//     }

//     console.log("✅ Daily digest sent");
//   } catch (error) {
//     console.error("❌ Error sending daily digest:", error.message);
//   }
// };

// module.exports = { startAlertScheduler, checkAndSendAlerts };













const cron = require("node-cron");
const Alert = require("../models/Alert");
const User = require("../models/User");
const { sendAlertEmail, sendDailyDigest } = require("./emailService");

// Check alerts every MINUTE and send emails
const startAlertScheduler = () => {
  console.log("🚀 Starting Alert Scheduler...");
  
  // Run every minute to check for alerts
  cron.schedule("* * * * *", async () => {
    console.log(`⏰ [${new Date().toLocaleTimeString()}] Checking for alerts...`);
    await checkAndSendAlerts();
  });

  // Send daily digest at 8 AM every day
  cron.schedule("0 8 * * *", async () => {
    console.log("📧 Sending daily digest emails...");
    await sendDailyDigests();
  });

  console.log("✅ Alert scheduler started (checking every minute)");
  console.log("📧 Email notifications are enabled");
};

// Check and send instant alert emails
const checkAndSendAlerts = async () => {
  try {
    const now = new Date();
    
    // Get current time boundaries (current minute only)
    const currentMinuteStart = new Date(now);
    currentMinuteStart.setSeconds(0, 0); // Start of current minute
    
    const currentMinuteEnd = new Date(now);
    currentMinuteEnd.setSeconds(59, 999); // End of current minute

    console.log(`🔍 Searching for alerts between ${currentMinuteStart.toLocaleTimeString()} and ${currentMinuteEnd.toLocaleTimeString()}`);

    // Find alerts due ONLY in the current minute that haven't been emailed
    const alerts = await Alert.find({
      alertDate: { 
        $gte: currentMinuteStart,
        $lte: currentMinuteEnd
      },
      isCompleted: false,
      emailSent: false,
    }).populate("userId", "name email emailNotifications")
      .populate("jobId", "company position");

    console.log(`📋 Found ${alerts.length} alerts due right now`);

    if (alerts.length > 0) {
      console.log(`🔔 Processing ${alerts.length} alerts...`);
    }

    for (const alert of alerts) {
      if (!alert.userId) {
        console.log(`⚠️ Alert ${alert._id} has no user, skipping`);
        continue;
      }

      const user = alert.userId;
      
      console.log(`👤 Processing alert for user: ${user.email}`);
      console.log(`   Alert: "${alert.title}"`);
      console.log(`   Type: ${alert.type}`);
      console.log(`   Due: ${new Date(alert.alertDate).toLocaleString()}`);
      
      // Check email notification preferences
      const emailNotifications = user.emailNotifications || {};
      console.log(`   Email Preferences:`, {
        enabled: emailNotifications.enabled,
        frequency: emailNotifications.frequency,
        types: emailNotifications.types
      });

      // Check if user has email notifications enabled
      if (emailNotifications.enabled === false) {
        console.log(`   ⚠️ User has email notifications DISABLED`);
        continue;
      }

      if (emailNotifications.frequency !== 'instant') {
        console.log(`   ⏳ User frequency is "${emailNotifications.frequency}", not instant`);
        continue;
      }

      if (emailNotifications.types && !emailNotifications.types.includes(alert.type)) {
        console.log(`   ⚠️ Alert type "${alert.type}" not in user's enabled types`);
        continue;
      }

      // Send email
      console.log(`   📧 Sending email to ${user.email}...`);
      const emailSent = await sendAlertEmail(
        user.email,
        user.name,
        alert,
        alert.jobId
      );

      if (emailSent) {
        // Mark as sent
        alert.emailSent = true;
        alert.emailSentAt = new Date();
        await alert.save();
        console.log(`   ✅ Email sent successfully!`);
      } else {
        console.log(`   ❌ Failed to send email`);
      }
    }
  } catch (error) {
    console.error("❌ Error checking alerts:", error.message);
    console.error(error.stack);
  }
};

// Send daily digest emails
const sendDailyDigests = async () => {
  try {
    const users = await User.find({
      "emailNotifications.enabled": true,
      "emailNotifications.frequency": "daily",
    });

    console.log(`📧 Sending daily digest to ${users.length} users`);

    for (const user of users) {
      const nextWeek = new Date();
      nextWeek.setDate(nextWeek.getDate() + 7);

      const alerts = await Alert.find({
        userId: user._id,
        alertDate: { $lte: nextWeek },
        isCompleted: false,
      }).populate("jobId", "company position");

      if (alerts.length > 0) {
        await sendDailyDigest(user.email, user.name, alerts);
        console.log(`✅ Daily digest sent to ${user.email}`);
      }
    }

    console.log("✅ Daily digest completed");
  } catch (error) {
    console.error("❌ Error sending daily digest:", error.message);
  }
};

module.exports = { startAlertScheduler, checkAndSendAlerts };