import rp from 'request-promise';
import cheerio from 'cheerio';
import potusParse from './potusParse';
import mongoose from 'mongoose';
import president from './models/president';


const url = 'https://en.wikipedia.org/wiki/List_of_Presidents_of_the_United_States';

rp(url)
  .then(function (html) {
    //success!
    const wikiUrls = [];
    for (let i = 0; i < 45; i++) {
      wikiUrls.push(cheerio('big > a', html)[i].attribs.href);
    }
    return Promise.all(
      wikiUrls.map(function (url) {
        return potusParse('https://en.wikipedia.org' + url);
      })
    );
  })
  .then(function (presidents) {
    for (var index = 0; index < presidents.length; index++) {
      let person = new Person();
      person.create({ name:  presidents[index].name, birthDay: presidents[index].birthday,   dateCrawled: new Date()}).
        then(doc => {
          return console.log(doc);
        }).
        then(doc => {
          console.log(doc);
        });
    }

  })

  .catch(function (err) {
    //handle error
    console.log(err);
  });


function upsertUser(userObj) {
  console.log("USER:", userObj)
  const DB_URL = 'mongodb://localhost:27017/auditor';

  if (mongoose.connection.readyState == 0) {
    mongoose.connect(DB_URL);
  }

  User.save().then(doc => {
    console.log(doc)
  })
    .catch(err => {
      console.error(err)
    })
}