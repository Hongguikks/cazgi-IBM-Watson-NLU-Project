const express = require('express');
const app = new express();
const dotenv = require('dotenv');
dotenv.config();

function getNluInstance() {
    let api_key = process.env.API_KEY;
    let api_url = process.env.API_URL;

    const NaturalLanguageUnderstandingV1 = require('ibm-watson/natural-language-understanding/v1');
    const {
        IamAuthenticator
    } = require('ibm-watson/auth');

    const naturalLanguageUnderstanding = new NaturalLanguageUnderstandingV1({
        version: '2020-08-01',
        authenticator: new IamAuthenticator({
            apikey: api_key,
        }),
        serviceUrl: api_url,
    });
    return naturalLanguageUnderstanding;
}

app.use(express.static('./client/build'))

const cors_app = require('cors');
const {
    json,
    query,
    text
} = require('express');
const {
    reset
} = require('nodemon');
app.use(cors_app());


app.get("/", (req, res) => {
    res.render('index.html');
});

app.get("/url/emotion/", (req, res) => {
    const analyzeParams = {
        'url': req.query.url,
        'features': {
            'entities': {
                'emotion': true,
                // 'sentiment': true,
                'limit': 2,
            },
            'keywords': {
                'emotion': true,
                // 'sentiment': true,
                'limit': 2,
            },
        },
    };
    let naturalLanguageUnderstanding = new getNluInstance();
    var result = [];
    naturalLanguageUnderstanding.analyze(analyzeParams)
        .then(analysisResults => {
            console.log(analysisResults.result.keywords[0].emotion);
            return res.send(analysisResults.result.keywords[0].emotion);
        })
        .catch(err => {
            console.log('error:', err);
        });
    //return res.send(result[0]);
    // res.send({
    //     "happy": "90",
    //     "sad": "10"
    // });
});

app.get("/url/sentiment", (req, res) => {
    const analyzeParams = {
        'url': req.query.url,
        'features': {
            'entities': {
                // 'emotion': true,
                'sentiment': true,
                'limit': 2,
            },
            'keywords': {
                // 'emotion': true,
                'sentiment': true,
                'limit': 2,
            },
        },
    };
    let naturalLanguageUnderstanding = new getNluInstance();
    naturalLanguageUnderstanding.analyze(analyzeParams)
        .then(analysisResults => {
            return res.send(analysisResults.result.keywords[0].sentiment.label);
        })
        .catch(err => {
            console.log('error:', err);
        });
    // return res.send({
    //     "happy": "10",
    //     "sad": "90"
    // });
});

app.get("/text/emotion", (req, res) => {

    const analyzeParams = {
        'text': req.query.text,
        'features': {
            'entities': {
                'emotion': true,
                // 'sentiment': true,
                'limit': 2,
            },
            'keywords': {
                'emotion': true,
                // 'sentiment': true,
                'limit': 2,
            },
        },
    };
    let naturalLanguageUnderstanding = new getNluInstance();
    var result = [];
    naturalLanguageUnderstanding.analyze(analyzeParams)
        .then(analysisResults => {
            return res.send(analysisResults.result.keywords[0].emotion);
        })
        .catch(err => {
            console.log('error:', err);
        });
});

app.get("/text/sentiment", (req, res) => {
    const analyzeParams = {
        'text': req.query.text,
        'features': {
            'keywords': {
                // 'emotion': true,
                'sentiment': true,
                'limit': 2,
            },
        },
    };
    let naturalLanguageUnderstanding = new getNluInstance();
    var result = [];
    naturalLanguageUnderstanding.analyze(analyzeParams)
        .then(analysisResults => {
            return res.send(analysisResults.result.keywords[0].sentiment.label);
        })
        .catch(err => {
            console.log('error:', err);
        });
    //return res.send("text sentiment for " + req.query.text);
});



let server = app.listen(8080, () => {
    console.log('Listening', server.address().port)
})