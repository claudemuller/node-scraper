var request = require('request');
var cheerio = require('cheerio');

var urlToFetch = 'http://archives.bassdrivearchive.com/';
var urlToFetchParts = urlToFetch.split('/');
var tld = urlToFetchParts[2];
var parsedLinks = [];

request(urlToFetch, function(error, request, body) {
    console.log(parseLink(body));
});

function parseLink(html) {
    var $ = cheerio.load(html);
    var links = $('a');

    for (var prop in links) {
        if (links[prop.toString()]['type'] == 'tag') {
            // console.log(links[prop.toString()]['attribs']);

            var urlParts = links[prop.toString()].attribs.href.split('/');
            var link = '';

            if (urlParts != undefined) {
                // console.log(urlParts);

                if (urlParts[0] !== 'http:') {
                    link = 'http://' + tld + '/' + decodeURIComponent(urlParts[1]);
                } else if (urlParts['2'].replace('www\.', '') === tld) {
                    link = 'http://' + urlParts.slice(2);
                }

                if (link !== '') {
                    console.log(link);
                    parsedLinks.push(link);
                    request(link, function(error, request, body) {
                        console.log(parseLink(body));
                    });
                }
            }
        }
    }
}
