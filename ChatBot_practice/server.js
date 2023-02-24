var express = require('express');
var app = express();
var request = require('request');
var { OpenAIApi, Configuration } = require('openai');

let config = new Configuration({
    apiKey: "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",
});

let openai = new OpenAIApi(config);

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html');
})

var client_id = 'WgkwLK_auiedKPKqf1zC';
var client_secret = 'DVyAYJj9jd';

app.get('/translate', function(req, res) {
    var api_url = 'https://openapi.naver.com/v1/papago/n2mt';
    var query = req.query.q;

    var options = {
        url: api_url,
        form: {'source':'en', 'target':'ko', 'text':query},
        headers: {'X-Naver-Client-Id':client_id, 'X-Naver-Client-Secret': client_secret}
    };
    request.post(options, function (error, response, body) {
        var 영어 = JSON.parse(body).message.result.translatedText;

        openai.createCompletion({
            model: "text-davinci-003",
            prompt: 영어,
            temperature: 0.7,
            max_tokens: 128,
            top_p: 1,
            frequency_penalty: 0,
        }).then((result) => {
            console.log('ai 응답', result.data.choices[0].text);

            var api_url = 'https://openapi.naver.com/v1/papago/n2mt';
            var query = result.data.choices[0].text;
            var options = {
                url: api_url,
                form: {'source':'ko', 'target':'en', 'text':query},
                headers: {'X-Naver-Client-Id':client_id, 'X-Naver-Client-Secret': client_secret}
            };
            request.post(options, function (error, response, body) {
                console.log(body);
                res.status(200).json(body);
            });
        }).catch((err) => {
            console.log(err);
        })
    });
});

app.listen(3000, function() {
    console.log('http://localhost:3000/ app listening on port 3000!');
});