var time = require('time');

// Create a new Date instance, representing the current instant in time
var now = new time.Date();

console.log(now);
now.setTimezone("America/Los_Angeles");
console.log(now);
// `.getDate()`, `.getDay()`, `.getHours()`, etc.
// will return values according to UTC-8

now.setTimezone("America/New_York");

console.log(now);
// `.getDate()`, `.getDay()`, `.getHours()`, etc.
// will return values according to UTC-5


// You can also set the timezone during instantiation
var azDate = new time.Date(2010, 0, 1, 'America/Phoenix');
azDate.getTimezone(); // 'America/Phoenix'
console.log(azDate);
var now = new time.Date();
var another = new time.Date('Aug 9, 1995', 'UTC');
console.log(another);
var more = new time.Date(1970, 0, 1, 'Europe/Amsterdam');
console.log(more);
