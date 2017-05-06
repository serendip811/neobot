var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var authcodeSchema = new Schema({
    user_key: String,	// 사용자키
    neowiz_id: String,	// 네오위즈 ID
    neowiz_mail: String,	// 네오위즈 Mail (ID + "@neowiz.com")
    auth_code: String,	// 임시 발급한 코드
    date: { type: Date, default: Date.now}
});

module.exports = mongoose.model('authcode', authcodeSchema);