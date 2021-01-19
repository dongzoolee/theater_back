const sendMail = require('../functional/sendMail');

sendMail.main("오류제보", "이거이거해주세요").catch(console.error)